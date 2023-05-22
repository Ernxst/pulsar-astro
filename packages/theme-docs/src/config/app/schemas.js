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
  defaultLocale: z.string().default("en"),
  dir: z.enum(["ltr", "rtl"]).default("ltr"),
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

export const Pagination = z
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
  .optional();

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

  navbar: Navbar.default({}),

  footer: Footer.default({}),

  /**
   * Whether to show the dark mode toggle in the sidebar.
   */
  darkMode: z.boolean().or(z.string()).default(true),

  /**
   * Customise the navigation buttons that appear at the bottom of each
   * documentation page.
   *
   * You can set this to `false` to disable the navigation buttons entirely or
   * configure the navigation buttons individually.
   *
   * Note that you can also customise the navigation buttons on a per-page basis
   * in the frontmatter of each page.
   *
   * @default true
   */
  pagination: Pagination.default(true),

  repositories: z
    .object({
      project: z
        .object({
          /**
           * @example "https://github.com/withastro/astro"
           */
          url: z.string(),
        })
        .optional(),

      /**
       * Separate configuration for the documentation repository in case it
       * is different to the project repository.
       */
      documentation: z.object({
        /**
         * Use this option if your documentation is in a different repository to
         * the project itself referenced in {@link repo}.
         *
         * If you don't provide a value for this option, the value of {@link project["repo"]}
         * will be used instead to determine the location of the documentation
         * files.
         *
         * This is used to fetch the repository metadata from the GitHub API so
         * that the 'Last updated' date can be shown as well as showing a link
         * to edit the page on GitHub.
         *
         * @example "https://github.com/withastro/docs"
         */
        url: z.string().optional(),
      }),
    })
    .partial()
    .default({}),

  seo: SEO.default({}),
});
