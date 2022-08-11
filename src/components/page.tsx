import { components } from "./all";
import { ImportContext } from "./import";
import { usePage } from "./use-page";

interface PageProps {
  path: string;
}

export function Page({ path }: PageProps) {
  const page = usePage(path);
  if (!page) {
    return <>Not Found!</>;
  }

  const { Content, frontmatter } = page;

  return (
    <ImportContext.Provider
      value={{
        stack: [],
        frontmatter,
        path,
      }}
    >
      <Content components={components} />
    </ImportContext.Provider>
  );
}
