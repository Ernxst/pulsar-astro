import { defineConfig } from "@pulsar/docs";

export default defineConfig({
  site: {
    siteTitle: "shadcn Svelte",
    titleTemplate: ({ title }) => `${title} - shadcn Svelte`,
    description: "A Svelte port of shadcn/ui component library",
    defaultLocale: "en",
  },

  navigate: true,

  repositories: {
    project: "https://github.com",
    docs: "https://github.com",
  },

  seo: {
    twitter: {
      cardType: "summary_large_image",
      site: "https://svelte.shadcn.dev",
    },
  },
});
