import path from "node:path";
import { titleize } from "inflection";

/**
 * @param {string} slug
 * @returns {import("../sidebar").MarkdownFile}
 */
export function mockMarkdownFile(slug) {
  const baseName = path.basename(slug, path.extname(slug));
  return {
    slug,
    headings: [titleize(baseName.replaceAll("-", "_"))],
    filepath: `${slug}.md`,
  };
}

/**
 * @param {string[]} pages
 * @returns {import("src/config").MetaJson}
 */
export function mockMeta(pages) {
  return { sidebar: pages };
}

/**
 *
 * @param {import("../sidebar").Sidebar} sidebarData
 */
export function flattenSidebar(sidebarData) {
  /**
   * @type {import("../sidebar").Section[]}
   */
  const flatSidebar = [];

  /**
   *
   * @param {import("../sidebar").Section} item
   */
  function traverseDirectory(item) {
    flatSidebar.push(item);

    if (item.children) {
      for (const key in item.children) {
        traverseDirectory(item.children[key]);
      }
    }
  }

  for (const key in sidebarData) {
    traverseDirectory(sidebarData[key]);
  }

  return flatSidebar;
}
