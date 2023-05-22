import { defineConfig } from "@pulsar/docs";

export default defineConfig({
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
});
