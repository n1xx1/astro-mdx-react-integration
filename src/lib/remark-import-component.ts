import { generateEstree } from "./estree";
import { visit } from "unist-util-visit";

export function remarkImportComponent() {
  return (root: any) => {
    visit(root, "mdxJsxFlowElement", (node) => {
      if (node.name !== "Import") return;
      const pathAttr = node.attributes.find(
        (x: any) => x.type === "mdxJsxAttribute" && x.name === "path"
      );
      if (typeof pathAttr.value !== "string") return;
      const code = `import("@content${pathAttr.value}.mdx")`;
      node.attributes.push({
        type: "mdxJsxAttribute",
        name: "promise",
        value: {
          type: "mdxJsxAttributeValueExpression",
          value: code,
          data: {
            estree: generateEstree(code),
          },
        },
      });
    });
  };
}
