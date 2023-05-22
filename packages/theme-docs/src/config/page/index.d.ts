import type { z } from "zod";
import type {
  DocsPageSchema,
  MainPageSchema,
  PulsarCollection,
  MetaJsonSchema,
} from "./schemas";

export type Page = z.infer<typeof PulsarCollection>;
export type MainPage = z.infer<typeof MainPageSchema>;
export type DocsPage = z.infer<typeof DocsPageSchema>;
export type MetaJson = z.infer<typeof MetaJsonSchema>;

export declare function definePulsarCollection(config: Page): Page;

export { PulsarCollection } from "./schemas";
