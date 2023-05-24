import type { z } from "zod";
import type {
  DocsPageSchema,
  MainPageSchema,
  PulsarCollection,
  PulsarMeta,
} from "./schemas";

export type Page = z.infer<typeof PulsarCollection>;
export type MainPage = z.infer<typeof MainPageSchema>;
export type DocsPage = z.infer<typeof DocsPageSchema>;
export type MetaJson = z.infer<typeof PulsarMeta>;

export declare function definePulsarCollection(config: Page): Page;

export const PulsarContentCollection = PulsarCollection.or(PulsarMeta);
export { PulsarCollection, PulsarMeta } from "./schemas";
