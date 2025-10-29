import requests
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.common.exceptions import TimeoutException
from concurrent.futures import ThreadPoolExecutor, as_completed
import os

def fetch_url(url):
    headers = {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36"
    }
    response = requests.get(url, headers=headers, timeout=10)
    response.raise_for_status()
    return response

def driver_setup():
    opts = Options()
    opts.add_argument("--headless=new")
    opts.add_argument("--no-sandbox")
    opts.add_argument("--disable-dev-shm-usage")
    opts.add_argument("--disable-gpu")
    opts.add_argument("--disable-extensions")
    opts.add_argument("--dns-prefetch-disable")
    opts.page_load_strategy = 'eager'  # Don't wait for all resources
    
    chromium_path = os.getenv("CHROMIUM_PATH")
    if chromium_path:
        opts.binary_location = chromium_path

    opts.add_argument("user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36")
    driver = webdriver.Chrome(options=opts)
    return driver

def extract_links(html, base_url):
    soup = BeautifulSoup(html, "html.parser")
    links = set()
    for a in soup.select(".product-items a[href], a.product-item-link[href]"):
        href = a.get("href", "").strip()
        if not href or href.startswith(("#", "mailto:", "tel:")):
            continue
        full_url = requests.compat.urljoin(base_url, href)
        if "/fr/" in full_url and full_url.rstrip("/").endswith("-ec"):
            links.add(full_url)
    return links

def fetch_page(page_num):
    url = f"https://www.saq.com/fr/cocktails?page_size=96&p={page_num}"
    
    # Try static HTML first
    try:
        resp = fetch_url(url)
        links = extract_links(resp.text, url)
        if links:
            return links
    except Exception:
        pass

    # Fallback to Selenium
    driver = driver_setup()
    try:
        driver.get(url)
        try:
            WebDriverWait(driver, 5).until(
                lambda d: bool(BeautifulSoup(d.page_source, "html.parser")
                               .select(".product-items a[href], a.product-item-link[href]"))
            )
        except TimeoutException:
            pass
        return extract_links(driver.page_source, url)
    finally:
        driver.quit()

def get_saq_cocktail_links():
    all_links = set()
    
    # Use ThreadPoolExecutor to fetch pages in parallel
    with ThreadPoolExecutor(max_workers=5) as executor:
        futures = {executor.submit(fetch_page, page): page for page in range(1, 11)}
        
        for future in as_completed(futures):
            try:
                links = future.result()
                all_links.update(links)
            except Exception as e:
                print(f"Error fetching page {futures[future]}: {e}")
    
    return list(all_links)

if __name__ == "__main__":
    print(get_saq_cocktail_links())