import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import { defineConfig } from "astro/config";
import { resolve } from "path";

// https://astro.build/config
export default defineConfig({
  integrations: [react(), mdx()],
  vite: {
    plugins: [
      {
        name: "mdx-postprocess-2",
        enforce: "post",
        transform(code, id) {
          if (!id.endsWith(".mdx")) return;
          code = code.replace(/"astro\/jsx-runtime"/g, `"react/jsx-runtime"`);
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
