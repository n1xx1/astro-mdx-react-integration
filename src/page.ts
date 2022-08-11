import type { MarkdownHeading, MarkdownInstance } from "astro";
import type { MDXContent } from "mdx/types";

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

export async function getPage(file: string): Promise<PageResult | null> {
  if (file.startsWith("/")) file = file.substring(1);

  const allPages = import.meta.glob<MarkdownInstance<Frontmatter>>(
    "@content/**/*.mdx"
  );

  const page = allPages["/src/content/" + file];
  if (!page) {
    return null;
  }

  const { default: defaultExport, frontmatter, getHeadings } = await page();
  return {
    Content: defaultExport as any as MDXContent,
    frontmatter,
    getHeadings,
  };
}
