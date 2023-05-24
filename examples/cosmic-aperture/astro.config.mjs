import { defineConfig } from "astro/config";
import docs from "@pulsar/docs";
import siitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://pulsarjs.dev",
  integrations: [
    siitemap(),
    docs({
      site: {
        siteTitle: "Pulsar",
        titleTemplate: ({ title }) => `${title} - Pulsar`,
        description:
          "An out of this world, batteries-included SSG and SSR-ready documentation builder framework for Astro.",
        defaultLocale: "en",
      },

      pagination: true,

      repositories: {
        project: {
          url: "https://github.com/Ernxst/pulsar",
        },
      },

      seo: {
        twitter: {
          cardType: "summary_large_image",
          site: "https://pulsarjs.dev",
        },
      },
    }),
  ],
});
