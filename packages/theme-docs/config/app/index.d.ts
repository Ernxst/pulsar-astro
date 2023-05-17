import type { z } from "zod";
import type { DocsConfigSchema } from "./schemas";

export type PulsarDocsConfig = z.infer<typeof DocsConfigSchema>;

export declare function defineConfig(
  config: PulsarDocsConfig
): PulsarDocsConfig;
