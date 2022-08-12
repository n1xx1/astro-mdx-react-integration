import type { MarkdownInstance } from "astro";
import { createContext, useContext } from "react";
import { usePromise } from "src/lib/use-promise";
import { Frontmatter, transformPage } from "../page";
import { components } from "./all";

interface ImportProps {
  promise?: Promise<MarkdownInstance<any>>;
  path: string;
}

export function Import({ path, promise }: ImportProps) {
  const ctx = useContext(ImportContext);
  const page = usePromise(async () => transformPage(await promise!), [path]);
  if (!page) {
    return <>Not Found!</>;
  }

  const { Content, frontmatter } = page;

  return (
    <ImportContext.Provider
      value={{
        stack: ctx
          ? [...ctx.stack, { frontmatter: ctx.frontmatter, path: ctx.path }]
          : [],
        frontmatter,
        path,
      }}
    >
      <Content components={components} />
    </ImportContext.Provider>
  );
}

interface ImportContextInstance {
  stack: { path: string; frontmatter: Frontmatter }[];
  path: string;
  frontmatter: Frontmatter;
}

export const ImportContext = createContext<ImportContextInstance | null>(null);
