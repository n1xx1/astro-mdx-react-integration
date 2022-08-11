import { createContext, useContext } from "react";
import type { Frontmatter } from "src/page";
import { components } from "./all";
import { usePage } from "./use-page";

interface ImportProps {
  path: string;
}

export function Import({ path }: ImportProps) {
  const ctx = useContext(ImportContext);
  const page = usePage(path + ".mdx");
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
