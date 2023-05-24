import path from "node:path";
import { PulsarRepository, formatUrl } from "pulsar/internal";

/**
 * @param {string} collection
 * @param {(collection: string) => Promise<import("..").PulsarCollectionEntry<import("../../config").Page>[]>} getCollection
 * @returns {Promise<import("src/components/LeftSidebar/sidebar").MarkdownFile[]>}
 */
export async function collectionToMarkdownFiles(collection, getCollection) {
  const entries = await getCollection(collection);

  return Promise.all(
    entries.map(async (p) => {
      const { headings } = await p.render();
      return {
        slug: p.slug,
        headings: headings.map((h) => h.text),
        filepath: p.id,
      };
    })
  );
}

/**
 * @typedef {object} PaginationOptions
 * @property {Partial<Pick<import("../../config").PulsarDocsConfig, "pagination">>} siteConfig;
 * @property {Partial<Pick<import("../../config").DocsPage, "pagination">>} pageConfig;
 */

/**
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
export async function useEditUrl(options) {
  const { siteConfig, pageCollection } = options;
  const { collection, id: filePath, data: pageConfig } = pageCollection;
  const showLink = pageConfig.editInGitHub !== false;
  if (!showLink) return null;

  const { url: projectUrl } = siteConfig.repositories.project ?? {};
  const { url: documentationUrl } = siteConfig.repositories.documentation ?? {};
  const docsUrl = documentationUrl ?? projectUrl;

  if (docsUrl) {
    const relativePath = formatUrl(`/src/content/${collection}/${filePath}`);
    const repository = new PulsarRepository();
    const relativeToRepoRoot = repository.relativeToRoot(relativePath);

    const { origin, pathname } = new URL(docsUrl);
    const [owner, repo] = pathname.split("/").filter(Boolean);

    const branch = await repository.branchName();
    console.log("repo", { branch });
    const joined = path.join(owner, repo, "edit", branch, relativeToRepoRoot);
    console.log({ origin, joined });

    return `${origin}/${joined}`;
  }

  return null;
}
