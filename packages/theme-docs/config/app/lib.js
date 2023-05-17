import fs from "node:fs";
import { DocsConfigSchema } from "./schemas.js";

export async function useConfig() {
  let configFile;

  if (fs.existsSync("./pulsar.config.ts")) {
    configFile = "/pulsar.config.ts";
  } else if (fs.existsSync("./pulsar.config.js")) {
    configFile = "/pulsar.config.js";
  } else if (fs.existsSync("./pulsar.config.cjs")) {
    configFile = "/pulsar.config.cjs";
  } else if (fs.existsSync("./pulsar.config.mjs")) {
    configFile = "/pulsar.config.mjs";
  } else if (fs.existsSync("./pulsar.config.cts")) {
    configFile = "/pulsar.config.cts";
  } else if (fs.existsSync("./pulsar.config.mts")) {
    configFile = "/pulsar.config.mts";
  } else {
    throw new Error("No config file found");
  }

  const config = await import(configFile);
  return config.default;
  // return DocsConfigSchema.parse(config.default);
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
