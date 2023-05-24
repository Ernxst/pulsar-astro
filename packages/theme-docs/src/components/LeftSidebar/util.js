import path from "node:path";

// Would really like to simplify this function, but it's a bit tricky to do so

/**
 * @param {import("./sidebar").MarkdownFile[]} mdFiles
 * @param {Record<string, import("src/config").MetaJson>} metaJsons
 */
export function sortFilesByMeta(mdFiles, metaJsons) {
  /**
   * @type {import("./sidebar").MarkdownFile[]}
   */
  const matchedFiles = [];

  for (const [metaFilePath, metaJson] of Object.entries(metaJsons)) {
    const { sidebar } = metaJson;

    // Extract the directory from the _meta.json file path
    const absMetaDir = path.dirname(metaFilePath);
    const metaDir = `/${absMetaDir.split("src/content/")[1]}`;

    // Filter files in the same directory as _meta.json
    const filteredFiles = mdFiles.filter(({ filepath }) => {
      const fileDir = path.dirname(filepath);
      if (metaDir.endsWith(fileDir)) return true;

      const withoutLastSegment = fileDir
        .split(path.sep)
        .slice(0, -1)
        .join(path.sep);

      return metaDir.endsWith(withoutLastSegment);
    });

    // Sort files based on the sidebar array
    filteredFiles.sort((a, b) => {
      const aFileDir = path.dirname(a.filepath);
      const bFileDir = path.dirname(b.filepath);

      let aFilename = path.basename(a.filepath, path.extname(a.filepath));
      let bFilename = path.basename(b.filepath, path.extname(b.filepath));

      // Two md files in the same directory
      /* eslint-disable-next-line no-empty */
      if (metaDir.endsWith(aFileDir) && metaDir.endsWith(bFileDir)) {
      } else if (metaDir.endsWith(aFileDir)) {
        // a is in the same directory as _meta.json, b is in a subdirectory of
        // a directory sibling to _meta.json
        bFilename = String(bFileDir.split(path.sep).at(-1));
      } else {
        // b is in the same directory as _meta.json, a is in a subdirectory of
        // a directory sibling to _meta.json
        aFilename = String(aFileDir.split(path.sep).at(-1));
      }

      const aIndex = sidebar.indexOf(aFilename);
      const bIndex = sidebar.indexOf(bFilename);

      if (aIndex === -1) return 1; // Place files not in the sidebar at the end
      if (bIndex === -1) return -1; // Place files not in the sidebar at the end
      return aIndex - bIndex;
    });

    // Add files to the array
    for (const file of filteredFiles) {
      /**
       * If the file already exists in the array, remove it and add it to the end
       * of the array. The most recent insertion of the file will be the one with
       * the correct sort order.
       */
      const existing = matchedFiles.find((m) => m.filepath === file.filepath);
      if (existing) {
        const idx = matchedFiles.indexOf(existing);
        // Remove the existing file
        matchedFiles.splice(idx, 1);
        // Add the file to the end of the array
        matchedFiles.push(file);
      } else {
        matchedFiles.push(file);
      }
    }
  }

  const remaining = mdFiles.filter((file) => !matchedFiles.includes(file));
  return [...matchedFiles, ...remaining];
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

  // Sort root sidebar items
  const entries = Object.entries(sidebar).sort(([fileA], [fileB]) => {
    const json = metaJsons[rootMetaJson].sidebar;
    const aIndex = json.indexOf(fileA);
    const bIndex = json.indexOf(fileB);

    if (aIndex === -1 && bIndex > -1) return 1;
    if (bIndex === -1 && aIndex > -1) return -1;
    return aIndex - bIndex;
  });

  return Object.fromEntries(entries);
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
