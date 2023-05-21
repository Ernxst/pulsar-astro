import { DocsConfigSchema } from "./schemas.js";

export async function usePulsarConfig() {
  /**
   * @type {Record<string, any>}
   */
  const configs = import.meta.glob(
    [
      "../../../../../**/pulsar.config.ts",
      "../../../../../**/pulsar.config.tsx",
      "../../../../../**/pulsar.config.cts",
      "../../../../../**/pulsar.config.mts",
      "../../../../../**/pulsar.config.js",
      "../../../../../**/pulsar.config.jsx",
      "../../../../../**/pulsar.config.cjs",
      "../../../../../**/pulsar.config.mjs",
      "../../../../../**/pulsar.config.json",
    ],

    { eager: true }
  );

  const config = Object.entries(configs)
    .map(([_, config]) => config.default)
    .find(Boolean);

  if (!config) {
    throw new Error(
      "No Pulsar config found. Please create a pulsar.config.(ts|js|json) file in the root of your project."
    );
  }

  const result = DocsConfigSchema.safeParse(config);
  if (!result.success) throw result.error;
  return result.data;
}

/**
 * Helper to extract details from the config
 *
 * @param {import(".").PulsarDocsConfig} config
 * @returns
 */
export function useConfigHandler(config) {
  return {
    /**
     * @param  {Parameters<Extract<import(".").PulsarDocsConfig["site"]["titleTemplate"], Function>>} opts
     * @returns
     */
    title(...opts) {
      const title = config.site.titleTemplate;
      if (typeof title === "string") return Promise.resolve(title);

      return title(...opts);
    },

    /**
     * @param  {Parameters<Extract<import(".").PulsarDocsConfig["site"]["description"], Function>>} opts
     * @returns
     */
    description(...opts) {
      const description = config.site.description;
      if (typeof description === "string") return description;

      return description(...opts);
    },
  };
}
