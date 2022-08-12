import type { Options as AcornOpts } from "acorn";
import { parse } from "acorn";
import type { MdxjsEsm } from "mdast-util-mdx";

export function jsToTreeNode(
  jsString: string,
  acornOpts: AcornOpts = {
    ecmaVersion: "latest",
    sourceType: "module",
  }
): MdxjsEsm {
  return {
    type: "mdxjsEsm",
    value: jsString,
    data: { estree: generateEstree(jsString, acornOpts) },
  };
}

export function generateEstree(
  jsString: string,
  acornOpts: AcornOpts = {
    ecmaVersion: "latest",
    sourceType: "module",
  }
) {
  return {
    body: [],
    ...parse(jsString, acornOpts),
    type: "Program" as const,
    sourceType: "module" as const,
  };
}
