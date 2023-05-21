/**
 * @param {string} url
 */
export function formatUrl(url) {
  const protocolIndex = url.indexOf("://");
  let formattedUrl = url;

  if (protocolIndex !== -1) {
    const protocol = url.substring(0, protocolIndex + 3);
    const restOfUrl = url.substring(protocolIndex + 3);
    const replacedUrl = restOfUrl.replace(/\/\//g, "/");
    formattedUrl = protocol + replacedUrl;
  } else {
    formattedUrl = url.replace(/\/\//g, "/");
  }

  return formattedUrl.replace(/\/$/, "");
}

/**
 *
 * @param {string} collection
 * @param {(collection: string) => Promise<import("..").PulsarCollectionEntry<import("../../config").Page>[]>} getCollection
 * @returns {Promise<import("src/components/LeftSidebar/sidebar").MarkdownFile[]>}
 */
export async function collectionToMarkdownFiles(collection, getCollection) {
  const entries = await getCollection(collection);

  return Promise.all(
    entries.map(async (p) => {
      const { headings } = await p.render();
      return { slug: p.slug, headings: headings.map((h) => h.text) };
    })
  );
}

/**
 * @typedef {object} PaginationOptions
 * @property {Partial<Pick<import("../../config").PulsarDocsConfig, "pagination">>} siteConfig;
 * @property {Partial<Pick<import("../../config").DocsPage, "pagination">>} pageConfig;
 */

/**
 *
 * @param {PaginationOptions} options
 */
export function usePagination(options) {
  const { siteConfig, pageConfig } = options;

  const pagePagination = pageConfig.pagination;
  const sitePagination = siteConfig.pagination;
  const pageNext =
    typeof pagePagination === "boolean" ? pagePagination : pagePagination?.next;
  const pagePrevious =
    typeof pagePagination === "boolean" ? pagePagination : pagePagination?.prev;

  const siteNext =
    typeof sitePagination === "boolean" ? sitePagination : sitePagination?.next;
  const sitePrevious =
    typeof sitePagination === "boolean" ? sitePagination : sitePagination?.prev;

  return {
    next: pageNext ?? Boolean(siteNext),
    prev: pagePrevious ?? Boolean(sitePrevious),
  };
}

/**
 * @typedef {object} EditUrlOptions
 * @property {Pick<import("../../config").PulsarDocsConfig, "repositories">} siteConfig;
 * @property {Pick<import("..").PulsarCollectionEntry<Pick<import("../../config").DocsPage, "type" | "editInGitHub">>, "collection" | "id" | "data">} pageCollection;
 */

/**
 * @param {EditUrlOptions} options
 */
export function useEditUrl(options) {
  const { siteConfig, pageCollection } = options;
  const { collection, id: filePath, data: pageConfig } = pageCollection;
  const showLink = pageConfig.editInGitHub !== false;
  if (!showLink) return null;

  const { url: projectUrl } = siteConfig.repositories.project ?? {};
  const { url: documentationUrl } = siteConfig.repositories.documentation ?? {};
  const docsUrl = documentationUrl ?? projectUrl;
  // TODO: Add `edit` into the URL after the owner/repo

  const filepath = formatUrl(`/src/content/${collection}/${filePath}`);
  return docsUrl ? formatUrl(`${docsUrl}/${filepath}`) : null;
}
