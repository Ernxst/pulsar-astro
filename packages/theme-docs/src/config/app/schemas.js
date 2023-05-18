import { z } from "zod";

const Image = z.object({
  src: z.string(),
  alt: z.string(),
});

const OpenGraph = z
  .object({
    type: z.string(),
    locale: z.string(),
    url: z.string(),
    siteName: z.string(),
    title: z.string(),
    description: z.string(),
    image: Image,
  })
  .partial();

const Twitter = z
  .object({
    handle: z.string(),
    site: z.string(),
    cardType: z
      .enum(["summary", "summary_large_image"])
      .default("summary_large_image"),
  })
  .partial();

/**
 * @template {z.ZodTypeAny} T
 * @param {T} schema
 * @returns
 */
function promisable(schema) {
  return z.union([schema, z.promise(schema)]);
}

const Fn = z
  .function()
  .args(z.object({ pathname: z.string(), title: z.string() }))
  .returns(promisable(z.string()));

const Site = z.object({
  /**
   * The title of the site.
   */
  siteTitle: z.string(),
  titleTemplate: z.string().or(Fn),
  /**
   * The default description of the site to use for SEO. This can be overridden
   * on a per-page basis.
   */
  description: z.string().or(Fn),
  defaultLocale: z.string().optional().default("en"),
  dir: z.enum(["ltr", "rtl"]).optional().default("ltr"),
});

const I18n = z.object({
  locales: z.array(z.record(z.string())).default([]),
});

const SEO = z.object({ openGraph: OpenGraph, twitter: Twitter }).partial();

const Footer = z.object({});

const SocialLink = z.object({
  name: z.string(),
  url: z.string(),
  icon: z.string().optional(),
});

const InternalLink = z.object({
  text: z.string(),
  url: z.string(),
});

const Navbar = z
  .object({
    logo: z.string().optional(),
    links: z.array(InternalLink).default([]),
    social: z.array(SocialLink).default([]),
  })
  .partial();

export const DocsConfigSchema = z.object({
  site: Site,
  i18n: I18n.default({}),

  navbar: Navbar.optional().default({}),

  footer: Footer.optional().default({}),

  /**
   * Customise the navigation buttons that appear at the bottom of each
   * documentation page.
   *
   * You can set this to `false` to disable the navigation buttons entirely or
   * configure the navigation buttons individually.
   *
   * @default true
   */
  navigate: z
    .boolean()
    .or(
      z
        .object({
          /**
           * Whether to show the "Next" button.
           */
          next: z.boolean().default(true),
          /**
           * Whether to show the "Previous" button.
           */
          prev: z.boolean().default(true),
        })
        .partial()
    )
    .optional()
    .default(true),

  repositories: z
    .object({
      /**
       * The base URL for the repository where you documentation is hosted.
       * This is used to show the "Edit this page" link.
       */
      docs: z.string(),
      /**
       * The base URL for the repository where your project is hosted. Unlike,
       * {@linkcode docs}, this is used to show a link to the project's
       * repository in the navbar and footer.
       */
      project: z.string(),
    })
    .partial()
    .optional()
    .default({}),

  seo: SEO.default({}),
});
