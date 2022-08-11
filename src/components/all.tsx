import type { MDXComponents } from "mdx/types";
import { Debug } from "./debug";
import { Import } from "./import";

export const components: MDXComponents = {
  Import: Import,
  Debug: Debug,
};
