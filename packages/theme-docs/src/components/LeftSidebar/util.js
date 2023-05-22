import path from "node:path";

/**
 * @param {import("./sidebar").MarkdownFile[]} mdFiles
 * @param {Record<string, import("src/config").MetaJson>} metaJsons
 */
export function sortFilesByMeta(mdFiles, metaJsons) {
  /**
   * @type {import("./sidebar").MarkdownFile[]}
   */
  const arrays = [];

  for (const [metaFilePath, metaJson] of Object.entries(metaJsons)) {
    const metaDir = path.dirname(metaFilePath);
    const files = mdFiles
      .filter((file) => {
        const mdDir = path.dirname(file.filepath);
        return metaDir.endsWith(mdDir);
      })
      .sort((a, b) => {
        const aFilename = path.basename(a.filepath, path.extname(a.filepath));
        const bFilename = path.basename(b.filepath, path.extname(b.filepath));
        return sortSection(aFilename, bFilename, metaJson);
      });

    arrays.push(...files);
  }

  const remaining = mdFiles.filter((file) => !arrays.includes(file));
  return [...arrays, ...remaining];
}

/**
 * @param {import("./sidebar").Sidebar} sidebar
 * @param {string} pathname
 * @param {Record<string, import("src/config").MetaJson>} metaJsons
 */
export function sortSidebar(sidebar, pathname, metaJsons) {
  const rootMetaJson = Object.keys(metaJsons).find((key) => {
    const regex = new RegExp(`${pathname}\/(.*?)\/_meta.json`);
    const matches = key.match(regex);

    if (matches) return matches[1].split("/").length <= 1;
    return false;
  });

  if (!rootMetaJson) return sidebar;

  const entries = Object.entries(sidebar).sort(([fileA], [fileB]) => {
    return sortSection(fileA, fileB, metaJsons[rootMetaJson]);
  });

  return Object.fromEntries(entries);
}

/**
 * @param {string} aFilename
 * @param {string} bFilename
 * @param {import("src/config").MetaJson} metaJson
 */
function sortSection(aFilename, bFilename, metaJson) {
  const json = metaJson.sidebar;
  const aIndex = json.indexOf(aFilename);
  const bIndex = json.indexOf(bFilename);

  if (aIndex === -1 && bIndex > -1) return 1;
  if (bIndex === -1 && aIndex > -1) return -1;
  return aIndex - bIndex;
}

/**
 * @param {string} dotPath
 * @param {any} object
 */
export function getValue(dotPath, object) {
  return dotPath.split(".").reduce((o, i) => o[i], object);
}

/**
 * @param {any} object
 * @param {string} path
 * @param {any} value
 */
export function setValue(object, path, value) {
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
