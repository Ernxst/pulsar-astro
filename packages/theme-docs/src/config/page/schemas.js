import { z } from "zod";

const PageBase = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  /**
   * Whether to show the navbar on this page.
   *
   * @default true
   */
  navbar: z.boolean().optional().default(true),

  /**
   * Whether to show the footer on this page.
   *
   * @default true
   */
  footer: z.boolean().optional().default(true),

  /**
   * Whether to show the breadcrumbs on this page.
   *
   * @default true
   */
  breadcrumbs: z.boolean().optional().default(true),
});

export const DocsPageSchema = PageBase.merge(
  z.object({
    type: z.enum(["docs"]).optional().default("docs"),
    editInGitHub: z.boolean().optional().default(true),
    /**
     * Whether to show the sidebar on this page.
     *
     * @default true
     */
    sidebar: z.boolean().optional().default(true),
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
