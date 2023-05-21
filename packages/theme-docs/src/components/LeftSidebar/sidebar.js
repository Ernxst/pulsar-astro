import { createRequire } from "node:module";
import path from "node:path";

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
 * @param {Pick<import("astro").MarkdownInstance<{}>, "getHeadings" | "file">[]} mdFiles
 * @returns {Sidebar}
 */
export function useSidebar(mdFiles) {
  /**
   * @type {Sidebar}
   */
  const sidebar = {};

  for (const mdFile of mdFiles) {
    const [{ text }] = mdFile.getHeadings();
    const filePath = mdFile.file;
    const slug = filePath
      .replace(/.*\/src\/content/, "")
      .replace(path.extname(filePath), "");

    const [first, ...segments] = slug
      .split("/")
      .filter(Boolean)
      // TODO: Too many assumptions
      .filter((s) => s !== "docs" && s !== "en");

    let dotPath = first;

    for (let i = 0; i < segments.length; i++) {
      const existing = getValue(dotPath, sidebar);
      if (!existing) {
        const previousPart = segments[i - 1] ?? first;
        const asUrl = dotPath.replaceAll(".children.", "/");
        const regexString = `(/\.*?)\/(${asUrl})`;
        const regex = new RegExp(regexString);
        const match = slug.match(regex);

        if (!match) throw new Error("No match");

        const [, prefix] = match;
        const url = `${prefix}/${asUrl}`;
        const isIndexPage = url.endsWith("index");

        /**
         * @type {Section}
         */
        const parent = {
          title: inflection.titleize(previousPart.replace("-", "_")),
          url: isIndexPage ? url.replace("/index", "") : undefined,
          children: {},
        };
        setValue(sidebar, dotPath, parent);
      }

      dotPath += ".";
      dotPath += "children";
      dotPath += ".";
      dotPath += segments[i];
    }

    const isIndexPage = slug.endsWith("index");
    const url = isIndexPage ? slug.replace("/index", "") : slug;
    /**
     * @type {Section}
     */
    const section = { title: text, url, children: {} };
    setValue(sidebar, dotPath, section);
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
