import type { MarkdownHeading, MarkdownInstance } from "astro";
import type { MDXContent } from "mdx/types";

declare module "astro" {
  interface MarkdownInstance<T extends Record<string, any>> {
    getHeadingsCustom(): Promise<MarkdownHeading[]>;
  }
}

export interface Frontmatter {
  title: string;
  name: string | null;
  type: string | null;
  level: number | null;
}

export interface PageResult {
  Content: MDXContent;
  frontmatter: Frontmatter;
  getHeadings: () => Promise<MarkdownHeading[]>;
}

export function transformPage(
  importedPage: MarkdownInstance<Frontmatter>
): PageResult {
  const {
    default: defaultExport,
    frontmatter,
    getHeadingsCustom,
  } = importedPage;
  return {
    Content: defaultExport as any as MDXContent,
    frontmatter,
    getHeadings: getHeadingsCustom,
  };
}

export async function getPage(file: string): Promise<PageResult | null> {
  if (file.startsWith("/")) file = file.substring(1);

  const allPages = import.meta.glob<MarkdownInstance<Frontmatter>>(
    "@content/**/*.mdx"
  );

  const page = allPages["/src/content/" + file];
  if (!page) {
    return null;
  }

  return transformPage(await page());
}
