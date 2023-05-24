import { DocsConfigSchema } from "./config/app/schemas";

/**
 * @returns {import("./config").PulsarDocsConfig}
 */
export function usePulsarConfig() {
  return globalThis.PulsarConfig;
}

/**
 * @param {import("./config").PulsarDocsConfig} docsConfiguration
 * @returns {import("astro").AstroIntegration}
 */
export function docs(docsConfiguration) {
  const config = DocsConfigSchema.parse(docsConfiguration);

  return {
    name: "pulsar-docs",
    hooks: {
      "astro:config:done": () => {
        globalThis.PulsarConfig = config;
      },
    },
  };
}
