import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface Drink {
  name: string;
  image: string;
  ingredients: string[];
  instructions?: string;
}

export interface CardData {
  el: HTMLElement;
  tags: string[];
}

export interface AlcoholMap {
  [key: string]: string[];
}

export interface Cocktail {
name: string;
image: string;
ingredients: string[];
url: string;
instructions?: string;
}

export interface CocktailWithTags extends Cocktail {
alcohols: string[];
}