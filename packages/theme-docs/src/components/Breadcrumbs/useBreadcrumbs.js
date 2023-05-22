/* eslint-disable-next-line import/no-named-default */
import { default as inflection } from "inflection";
import { getValue } from "../LeftSidebar/util";
import { isLanguageCode } from "../../lib/util";

/**
 * @typedef {object} Breadcrumb
 * @property {string} title
 * @property {string | undefined} url
 */

/**
 * @param {string} url
 * @param {import("../LeftSidebar/sidebar").Sidebar} sidebar
 * @param {string} collectionName
 * @returns {Breadcrumb[]}
 */
export function useBreadcrumbs(url, sidebar, collectionName) {
  /**
   * @type {Breadcrumb[]}
   */
  const result = [];
  const segments = url.split("/").filter(Boolean);

  if (segments[0] === collectionName) {
    result.push({
      title: inflection.titleize(segments[0]),
      url: `/${segments[0]}`,
    });
    segments.shift();
  }

  if (isLanguageCode(segments[0])) {
    const languageCode = segments[0];
    if (result[0]) result[0].url += `/${languageCode}`;

    segments.shift();
  }

  let dotPath = "";

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
      result.push({ title: section.title, url: section.url });
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
    addBreadcrumbSection(`${dotPath}.children.${segment}`);
  }

  return result;
}
