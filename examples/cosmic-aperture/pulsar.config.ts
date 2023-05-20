import { defineConfig } from "@pulsar/docs";

export default defineConfig({
  site: {
    siteTitle: "shadcn Svelte",
    titleTemplate: ({ title }) => `${title} - shadcn Svelte`,
    description: "A Svelte port of shadcn/ui component library",
    defaultLocale: "en",
  },

  pagination: true,

  repositories: {
    project: {
      url: "https://github.com/Ernxst/pulsar",
    },
    documentation: {
      url: "https://github.com/Ernxst/pulsar/tree/main/examples/cosmic-aperture",
      token: "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",
    },
  },

  seo: {
    twitter: {
      cardType: "summary_large_image",
      site: "https://svelte.shadcn.dev",
    },
  },
});
