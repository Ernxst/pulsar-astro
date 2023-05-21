/* eslint-disable-next-line import/no-named-default */
import { default as inflection } from "inflection";
import { getValue } from "../LeftSidebar/sidebar";

/**
 * @typedef {object} Breadcrumb
 * @property {string} title
 * @property {string | undefined} url
 */

/**
 *
 * @param {string} url
 * @param {import("../LeftSidebar/sidebar").Sidebar} sidebar
 * @returns {Breadcrumb[]}
 */
export function useBreadcrumbs(url, sidebar) {
  // TODO: This assumes the first segment is the docs path - may not be safe
  const [docs, lang, ...segments] = url.split("/").filter(Boolean);
  const languageNames = new Intl.DisplayNames([lang], { type: "language" });

  // If the second segment is not a language code, add it back to the segments
  const langName = languageNames.of(lang);
  if (!langName) segments.unshift(lang);

  let dotPath = "";
  // TODO: Fix too many assumptions
  /**
   * @type {Breadcrumb[]}
   */
  const result = [{ title: "Documentation", url: `/${docs}` }];

  /**
   * @param {string} path
   */
  function addBreadcrumbSection(path) {
    /**
     * @type {import("../LeftSidebar/sidebar").Section | undefined}
     */
    const section = getValue(path, sidebar);

    if (section) {
      dotPath = path;
      const { children, title, url } = section;
      const href = url ?? children.index?.url ?? undefined;
      result.push({ title, url: href });
      return true;
    }

    return false;
  }

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];

    // Check if the segment is a top-level section and add it to the breadcrumb
    const topLevelPath = dotPath ? `${dotPath}.${segment}` : segment;
    if (addBreadcrumbSection(topLevelPath)) continue;

    // Check if the segment is a nested section and add it to the breadcrumb
    const nestedPath = dotPath ? `${dotPath}.children.${segment}` : segment;
    if (addBreadcrumbSection(nestedPath)) continue;

    // I can't see how this would ever be reached, but just in case
    const title = inflection.titleize(segment.replace("-", "_"));
    const url = `/${segments.slice(0, i + 1).join("/")}`;

    result.push({ title, url });
  }

  return result;
}
