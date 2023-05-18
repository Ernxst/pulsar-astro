import { defineConfig } from "vitest/config";

export default defineConfig({
  // https://github.com/vitest-dev/vitest
  test: {
    watch: false,
    coverage: {
      provider: "istanbul",
      enabled: true,
      all: true,
      reporter: ["html", "text-summary", "json"],
      include: ["**/*"],
      exclude: ["**/__test__/**", "**/*.astro", "node_modules/**/*"],
    },
  },
});
