import { z } from "zod";
import { Pagination } from "../app/schemas";

export const PulsarMeta = z.object({ sidebar: z.array(z.string()) });

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
    /**
     * Customise the navigation buttons that appear at the bottom of the
     * page.
     *
     * You can set this to `false` to disable the navigation buttons entirely or
     * configure the navigation buttons individually.
     *
     * Note that you can also customise the navigation buttons at the site level
     * in your `pulsar.config.js` file.
     *
     * @default true
     */
    pagination: Pagination,
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

export const PulsarContentCollection = PulsarCollection.or(PulsarMeta);
