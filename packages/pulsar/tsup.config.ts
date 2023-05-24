import { defineConfig } from "tsup";

export default defineConfig({
  format: ["esm"],
  entry: {
    index: "src/index.js",
    "internal/index": "src/internal/index.js",
  },
  noExternal: ["inflection", "simple-git"],
  splitting: false,
  sourcemap: true,
  dts: true,
  clean: true,
  banner: {
    js: `
    import { fileURLToPath } from 'url';
    import bannerPath from 'path';
    import { createRequire as topLevelCreateRequire } from 'module';
    const require = topLevelCreateRequire(import.meta.url);
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = bannerPath.dirname(__filename);
    `,
  },
});
