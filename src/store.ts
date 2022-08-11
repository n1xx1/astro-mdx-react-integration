export const pageData: Record<string, any> = {};
import type { AstroGlobal } from "astro";

export function setPageData(astro: AstroGlobal, p: any | ((p: any) => void)) {
  const path = astro.url.pathname + astro.url.search;
  pageData[path] = typeof p === "function" ? p(pageData[path]) : p;
}

export function getPageData<T = any>(astro: AstroGlobal) {
  const path = astro.url.pathname + astro.url.search;
  return pageData[path];
}
