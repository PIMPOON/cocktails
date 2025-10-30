import pandas as pd
from bs4 import BeautifulSoup
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.common.exceptions import NoSuchElementException, TimeoutException
from urllib.parse import urljoin
from concurrent.futures import ThreadPoolExecutor, as_completed
from saq_links import get_saq_cocktail_links, fetch_url, driver_setup
import json

# Faster scraper: single-parse per page + concurrent HTTP phase, minimal Selenium fallback

def fetch_drink(url, use_selenium=True):
    def parse_ingredients(soup):
        items = []
        blocks = soup.select(
            '.ingredients .value, .ingredients-text .value, '
            '.cocktail-ingredients .value, .cocktail__ingredients .value, '
            '[itemprop="recipeIngredient"]'
        )
        for b in blocks:
            text = b.get_text("\n", strip=True)
            for raw in text.replace('•', '\n').replace('·', '\n').splitlines():
                raw = raw.strip(" -–—\t\r ")
                if raw:
                    items.append(raw)

        seen, result = set(), []
        for it in items:
            cleaned = " ".join(it.split())
            if cleaned and cleaned not in seen:
                seen.add(cleaned)
                result.append(cleaned)
        return result

    def parse_name(soup):
        el = soup.select_one(".page-title, h1.page-title, [data-ui-id='page-title-wrapper']")
        return el.get_text(strip=True) if el else ""

    def parse_preparation(soup):
        steps = []

        li_nodes = soup.select(
            ".cocktail.preparation-text li, .cocktail .preparation-text li, "
            ".preparation-text li, [itemprop='recipeInstructions'] li"
        )
        if li_nodes:
            for li in li_nodes:
                t = li.get_text(" ", strip=True)
                if t:
                    steps.append(t)
        else:
            block = soup.select_one(
                ".cocktail.preparation-text, .cocktail .preparation-text, "
                ".preparation-text, [itemprop='recipeInstructions']"
            )
            if block:
                text = block.get_text("\n", strip=True)
                for raw in text.replace('•', '\n').replace('·', '\n').splitlines():
                    raw = raw.strip(" -–—\t\r ")
                    if raw:
                        steps.append(raw)

        seen, out = set(), []
        for s in steps:
            s_clean = " ".join(s.split())
            if s_clean and s_clean not in seen:
                seen.add(s_clean)
                out.append(s_clean)
        return out

    def parse_image(soup, base_url):
        candidates = []

        for sel, attr in [
            ('meta[property="og:image"]', 'content'),
            ('meta[property="og:image:secure_url"]', 'content'),
            ('meta[name="twitter:image"]', 'content'),
            ('link[rel="image_src"]', 'href'),
            ('meta[itemprop="image"]', 'content'),
        ]:
            el = soup.select_one(sel)
            if el and el.get(attr):
                candidates.append(el.get(attr).strip())

        def pick_from_srcset(srcset):
            best_url, best_w, best_x = None, -1, -1.0
            for part in srcset.split(","):
                p = part.strip()
                if not p:
                    continue
                pieces = p.split()
                url_only = pieces[0]
                desc = pieces[1] if len(pieces) > 1 else ""
                if desc.endswith("w"):
                    try:
                        w = int(desc[:-1])
                        if w > best_w:
                            best_w, best_url = w, url_only
                    except ValueError:
                        pass
                elif desc.endswith("x"):
                    try:
                        x = float(desc[:-1])
                        if x > best_x:
                            best_x, best_url = x, url_only
                    except ValueError:
                        pass
                else:
                    if not best_url:
                        best_url = url_only
            return best_url

        for el in soup.select('img'):
            srcset = el.get("srcset") or el.get("data-srcset")
            if srcset:
                chosen = pick_from_srcset(srcset)
                if chosen:
                    candidates.append(chosen.strip())
            for attr in ("src", "data-src", "data-original", "data-lazy", "data-image"):
                v = el.get(attr)
                if v:
                    candidates.append(v.strip())

        for cand in candidates:
            if not cand:
                continue
            abs_url = urljoin(base_url, cand)
            if any(t in abs_url.lower() for t in ["placeholder", "spacer", "transparent", "data:image"]):
                continue
            return abs_url
        return ""

    name = ""
    html = ""
    ingredients = []
    preparation = []
    image = ""

    resp_url = url
    try:
        resp = fetch_url(url)
        resp_url = getattr(resp, "url", url) or url
        html = resp.text or ""
        if html:
            soup = BeautifulSoup(html, "html.parser")
            ingredients = parse_ingredients(soup)
            preparation = parse_preparation(soup)
            name = parse_name(soup)
            image = parse_image(soup, resp_url)
    except Exception:
        pass

    need_selenium = use_selenium and (not name or not ingredients or not preparation or not image)
    if need_selenium:
        driver = driver_setup()
        try:
            driver.get(url)

            def ready(d):
                if d.find_elements(By.CLASS_NAME, "page-title"):
                    return True
                s = BeautifulSoup(d.page_source, "html.parser")
                return bool(s.select(
                    '[itemprop="recipeIngredient"], .ingredients .value, .ingredients-text .value, '
                    '.cocktail__ingredients .value, .cocktail.preparation-text, .cocktail .preparation-text, '
                    '.preparation-text, [itemprop="recipeInstructions"], meta[property="og:image"], img'
                ))

            try:
                WebDriverWait(driver, 8).until(ready)
            except TimeoutException:
                pass

            html = driver.page_source
            soup = BeautifulSoup(html, "html.parser")

            if not name:
                try:
                    title_el = driver.find_element(By.CLASS_NAME, "page-title")
                    name = title_el.text.strip() or name
                except NoSuchElementException:
                    name = parse_name(soup) or name

            if not ingredients:
                ingredients = parse_ingredients(soup)
            if not preparation:
                preparation = parse_preparation(soup)
            if not image:
                image = parse_image(soup, driver.current_url)
        finally:
            driver.quit()

    return {"name": name, "url": url, "ingredients": ingredients, "preparation": preparation, "image": image}


# Concurrent run: fast HTTP-only pass, then small Selenium fallback for incomplete ones
saq_links = get_saq_cocktail_links()
results = []
errors = []

# Respect existing results/errors; skip already processed URLs
processed = {r.get("url") for r in results if isinstance(r, dict)}
queue = [u for u in saq_links if u not in processed]

total = len(saq_links)
print(f"Queued {len(queue)} of {total} URLs (skipping {len(processed)} already done).")

# Phase 1: HTTP-only, high concurrency
max_workers = min(16, max(4, len(queue) // 32 or 4))
done = 0
futures = []
if queue:
    with ThreadPoolExecutor(max_workers=max_workers) as ex:
        for u in queue:
            futures.append(ex.submit(fetch_drink, u, False))
        for fut in as_completed(futures):
            try:
                r = fut.result()
                results.append(r)
            except Exception as e:
                # We don't know which URL failed here unless we carry it; keep generic
                errors.append({"url": None, "error": str(e)})
            done += 1
            if done % 25 == 0 or done == len(queue):
                print(f"HTTP phase: {done}/{len(queue)} done", end="\r")
    print()

# Phase 2: Selenium fallback only for incomplete
def is_incomplete(r):
    return not (r.get("name") and r.get("ingredients") and r.get("preparation") and r.get("image"))

url_to_index = {r["url"]: idx for idx, r in enumerate(results) if isinstance(r, dict) and "url" in r}
need_fallback = [r["url"] for r in results if isinstance(r, dict) and is_incomplete(r)]

if need_fallback:
    print(f"Selenium fallback for {len(need_fallback)} pages...")
    # Keep selenium concurrency low to avoid heavy load
    with ThreadPoolExecutor(max_workers=2) as ex:
        futmap = {ex.submit(fetch_drink, u, True): u for u in need_fallback}
        for fut in as_completed(futmap):
            u = futmap[fut]
            try:
                r2 = fut.result()
                idx = url_to_index.get(u)
                if idx is not None:
                    results[idx] = r2
                else:
                    results.append(r2)
            except Exception as e:
                errors.append({"url": u, "error": str(e)})

# Save results to JSON file
output_file = "saq_cocktails.json"
with open(output_file, "w", encoding="utf-8") as f:
    json.dump(results, f, ensure_ascii=False, indent=2)

print(f"Saved {len(results)} cocktails to {output_file}")

### must remove duplicates like absinthe cocktails with different urls but same name