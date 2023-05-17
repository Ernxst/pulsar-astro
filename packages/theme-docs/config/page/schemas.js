import { z } from "zod";

const SidebarSection = z.object({
  /**
   * The title of the section - this is what will be displayed in the sidebar
   * and used as the title of the page.
   */
  title: z.string(),
  /**
   * Whether to show the sidebar on this page.
   *
   * @default true
   */
  sidebar: z.boolean().default(true),
  /**
   * Whether to show the navbar on this page.
   *
   * @default true
   */
  navbar: z.boolean().default(true),
});

const Sidebar = z.array(SidebarSection).default([]);

const PageBase = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
});

export const DocsPageSchema = PageBase.merge(
  z.object({
    type: z.enum(["docs"]).optional(),
    editInGitHub: z.boolean().optional().default(true),
  })
);

export const MainPageSchema = PageBase.merge(
  z.object({
    type: z.enum(["page"]),
  })
);

export const PulsarCollection = z
  .union([DocsPageSchema, MainPageSchema])
  .default({
    type: "docs",
  });

/**
 * @type {{[K in keyof z.infer<typeof DocsPageSchema>]: z.infer<typeof DocsPageSchema>[K]} & {}}
 */
let docs;

/**
 * @type {{[K in keyof z.infer<typeof MainPageSchema>]: z.infer<typeof MainPageSchema>[K]} & {}}
 */
let main;

/**
 * @type {{[K in keyof z.infer<typeof PulsarCollection>]: z.infer<typeof PulsarCollection>[K]} & {}}
 */
let pulsar;
