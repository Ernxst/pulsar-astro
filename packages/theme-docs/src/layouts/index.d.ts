import type { MarkdownHeading, MarkdownInstance } from "astro";

export { default as DocsLayout } from "./DocsLayout.astro";
export { default as PageLayout } from "./PageLayout.astro";
export { default as PulsarPage } from "./PulsarPage/PulsarPage.astro";

/**
 * Duplicated from 'astro:content' as Pulsar cannot import
 * generated files from consuming projects.
 */
export interface PulsarCollectionEntry<Schema extends object> {
  id: string;
  slug: string;
  body: string;
  collection: string;
  data: Schema;
  render(): Render[".md"];
}

interface Render {
  ".md": Promise<{
    Content: MarkdownInstance["Content"];
    headings: MarkdownHeading[];
  }>;
}
