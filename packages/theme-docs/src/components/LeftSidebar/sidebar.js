import { createRequire } from "node:module";
import { Lang, formatUrl } from "pulsar/internal";
import { getValue, setValue, sortFilesByMeta, sortSidebar } from "./util";

const require = createRequire(import.meta.url);
/**
 * @typeof import("inflection")
 */
const inflection = require("inflection");

/**
 * @typedef {object} Section
 * @property {string} title
 * @property {string | undefined} url
 * @property {Record<string, Section>} children
 *
 * @typedef {Record<string, Section>} Sidebar
 */
/**
 * @typedef {object} MarkdownFile
 * @property {string[]} headings
 * @property {string} slug
 * @property {string} filepath
 */

/**
 * @param {MarkdownFile[]} mdFiles
 * @param {string} pathname
 * @param {Record<string, import("src/config").MetaJson>} metaJsons
 * @returns {Sidebar}
 */
export function useSidebar(mdFiles, pathname, metaJsons = {}) {
  mdFiles = sortFilesByMeta(mdFiles, metaJsons);
  /**
   * @type {Sidebar}
   */
  const sidebar = {};

  /**
   * @param {string} dotPath
   * @param {string} rootSegment
   * @param {Section} section
   */
  function addSection(dotPath, rootSegment, section) {
    const path = dotPath === "" ? rootSegment : dotPath;
    const existing = getValue(path, sidebar) ?? {};
    const merged = {
      title: existing.title ?? section.title,
      url: existing.url ?? section.url,
      children: { ...existing.children, ...section.children },
    };
    setValue(sidebar, path, merged);
  }

  for (const { headings, slug } of mdFiles) {
    const [lang, ...segments] = slug.split("/").filter(Boolean);

    let baseUrl = pathname;
    if (Lang.isCode(lang)) baseUrl += `/${lang}`;
    else segments.unshift(lang);

    let dotPath = "";

    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      const isLast = i === segments.length - 1;
      // Check if this is the last segment (on top of == index)
      // in case the consumer has a directory named "index"
      if (segment === "index" && isLast) continue;

      if (dotPath !== "") dotPath += ".children.";
      dotPath += segment;

      const nextSegment = segments[i + 1];
      const url = `${baseUrl}/${segments.slice(0, i + 1).join("/")}`;
      const title = isLast
        ? headings[0]
        : inflection.titleize(segment.replaceAll("-", "_"));

      addSection(dotPath, segment, {
        title,
        url: nextSegment === "index" ? formatUrl(url) : undefined,
        children: {},
      });
    }

    const url = slug.replace(/\/index$/, "");
    addSection(dotPath, segments[0], {
      title: headings[0],
      url: formatUrl(`${pathname}/${url}`),
      children: {},
    });
  }

  return sortSidebar(sidebar, pathname, metaJsons);
}
