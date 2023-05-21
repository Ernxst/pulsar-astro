/**
 * @param {string} url
 */
export function formatUrl(url) {
  return url.replaceAll("//", "/");
}

/**
 * @typedef {object} PaginationOptions
 * @property {import("../../config").PulsarDocsConfig} siteConfig;
 * @property {Pick<import("../../config").DocsPage, "pagination">} pageConfig;
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
 * @property {import("../../config").PulsarDocsConfig} siteConfig;
 * @property {import("..").PulsarCollectionEntry<import("../../config").Page>} pageCollection;
 */

/**
 * @param {EditUrlOptions} options
 */
export function useEditUrl(options) {
  const { siteConfig, pageCollection } = options;
  const { collection, id: filePath, data: pageConfig } = pageCollection;
  const isDocs = pageConfig.type === "docs";

  const { url: projectUrl } = siteConfig.repositories.project ?? {};
  const { url } = siteConfig.repositories.documentation ?? {};
  const docsUrl = url ?? projectUrl;

  // TODO: Fix - this is wrong - it assumes the page will be in a subdirectory of /src/content
  // with the same name as the collection - Collections != pages
  const filepath = formatUrl(`/src/content/${collection}/${filePath}`);
  const showLink = isDocs ? pageConfig.editInGitHub !== false : true;
  const link = docsUrl ? formatUrl(`${docsUrl}/${filepath}`) : undefined;
  return showLink ? link : undefined;
}
