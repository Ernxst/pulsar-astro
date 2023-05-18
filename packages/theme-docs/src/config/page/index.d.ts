import type { z } from "zod";
import type {
  DocsPageSchema,
  MainPageSchema,
  PulsarCollection,
} from "./schemas";

export type Page = z.infer<typeof PulsarCollection>;
export type MainPage = z.infer<typeof MainPageSchema>;
export type DocsPage = z.infer<typeof DocsPageSchema>;

export declare function definePulsarCollection(config: Page): Page;

export { PulsarCollection } from "./schemas";
