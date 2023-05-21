import { createRequire } from "node:module";
import { formatUrl } from "../../layouts/PulsarPage/lib";

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
 */

/**
 * @param {MarkdownFile[]} mdFiles
 * @param {string} pathname
 * @returns {Sidebar}
 */
export function useSidebar(mdFiles, pathname) {
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
    const languageNames = Intl.DisplayNames.supportedLocalesOf([lang]);

    let baseUrl = pathname;
    if (languageNames.includes(lang)) baseUrl += `/${lang}`;
    else segments.unshift(lang);

    let dotPath = "";

    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      if (segment === "index") continue;

      if (dotPath !== "") dotPath += ".children.";
      dotPath += segment;

      const nextSegment = segments[i + 1];
      const url = `${baseUrl}/${segments.slice(0, i + 1).join("/")}`;

      addSection(dotPath, segment, {
        title: inflection.titleize(segments[i].replace("-", "_")),
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

  return sidebar;
}

/**
 * @param {string} dotPath
 * @param {any} object
 * @returns
 */
export function getValue(dotPath, object) {
  return dotPath.split(".").reduce((o, i) => o[i], object);
}

/**
 * @param {any} object
 * @param {string} path
 * @param {any} value
 */
function setValue(object, path, value) {
  const way = path.replace(/\[/g, ".").replace(/\]/g, "").split(".");
  /**
   * @type {string}
   */
  const last = way.pop();

  way.reduce((obj, key, index, remainingKeys) => {
    return (obj[key] =
      obj[key] ||
      (isFinite(index + 1 in remainingKeys ? remainingKeys[index + 1] : last)
        ? []
        : {}));
  }, object)[last] = value;
}
