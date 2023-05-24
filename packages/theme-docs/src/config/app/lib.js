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
