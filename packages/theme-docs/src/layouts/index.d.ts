import type { MarkdownHeading, MarkdownInstance } from "astro";

export type { default as DocsLayout } from "./DocsLayout.astro";
export type { default as PageLayout } from "./PageLayout.astro";
export type { default as PulsarPage } from "./PulsarPage.astro";

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
