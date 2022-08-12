import Slugger from "github-slugger";
import { visit } from "unist-util-visit";
import { jsToTreeNode } from "./estree";

export function rehypeCustomHeadings() {
  const slugger = new Slugger();

  function toText(node: any) {
    let text = "";
    visit(node, (child, __, parent) => {
      if (child.type === "element" || parent == null) {
        return;
      }
      if (child.type === "raw" && child.value.match(/^\n?<.*>\n?$/)) {
        return;
      }
      if (new Set(["text", "raw", "mdxTextExpression"]).has(child.type)) {
        text += child.value;
      }
    });
    return text;
  }

  return (tree: any) => {
    const headings: string[] = [];
    visit(tree, (node) => {
      if (node.type === "element" && node.tagName[0] === "h") {
        if (node.tagName[0] !== "h") return;
        const [_, level] = node.tagName.match(/h([0-6])/) ?? [];
        if (!level) return;
        const depth = Number.parseInt(level);
        const text = toText(node);
        node.properties = node.properties || {};
        if (typeof node.properties.id !== "string") {
          let slug = slugger.slug(text, false);
          if (slug.endsWith("-")) {
            slug = slug.slice(0, -1);
          }
          node.properties.id = slug;
        }
        headings.push(
          JSON.stringify({ depth, slug: node.properties.id, text })
        );
        return;
      }

      if (node.type === "mdxJsxFlowElement" && node.name === "Import") {
        const pathAttr = node.attributes.find(
          (x: any) => x.type === "mdxJsxAttribute" && x.name === "path"
        );
        if (typeof pathAttr.value !== "string") return;
        const code = `
  ...(await import("@content${pathAttr.value}.mdx")
    .then(x => x.getHeadingsCustom())
    .then(x => x.map(y => ({...y, depth: y.depth + 1})))
  )`;
        headings.push(code);
      }
    });

    const result = `
  export async function getHeadingsCustom() {
    return [
      ${headings.join(", ")}
    ];
  }`;
    tree.children.unshift(jsToTreeNode(result));
  };
}
