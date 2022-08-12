import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import { defineConfig } from "astro/config";
import { resolve } from "path";
import { remarkImportComponent } from "./src/lib/remark-import-component";
import { rehypeCustomHeadings } from "./src/lib/rehype-custom-headings";

// https://astro.build/config
export default defineConfig({
  integrations: [
    react(),
    mdx({
      remarkPlugins: { extends: [remarkImportComponent] },
      rehypePlugins: { extends: [rehypeCustomHeadings] },
    }),
  ],
  vite: {
    plugins: [
      {
        name: "mdx-postprocess-2",
        enforce: "post",
        transform(code, id) {
          if (!id.endsWith(".mdx")) return;
          code = code.replace(/"astro\/jsx-runtime"/g, `"react/jsx-runtime"`);
          // console.log(code);
          return code;
        },
      },
    ],
    resolve: {
      alias: {
        "@content": resolve("./src/content"),
      },
    },
  },
});
