import { usePromise } from "src/lib/use-promise";
import { getPage } from "../page";
import { components } from "./all";
import { ImportContext } from "./import";

interface PageProps {
  path: string;
}

export function Page({ path }: PageProps) {
  const page = usePromise(
    async (path: string) => await getPage(path),
    [path, "page"],
    500
  );
  if (!page) {
    return <>Not Found!</>;
  }

  const { Content, frontmatter, getHeadings } = page;
  const headings = usePromise(
    async () => await getHeadings(),
    [path, "headings"],
    500
  );

  console.log(headings);

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
