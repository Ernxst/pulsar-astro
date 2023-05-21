/**
 * @param {string} pathname
 * @param {import("../LeftSidebar/sidebar").Sidebar} sidebarData
 * @returns
 */
export function usePrevNext(pathname, sidebarData) {
  /**
   * @type {import("../LeftSidebar/sidebar").Section[]}
   */
  const flatSidebar = [];

  /**
   *
   * @param {import("../LeftSidebar/sidebar").Section} item
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

  const sidebar = flatSidebar.filter((item) => Boolean(item.url));

  for (let i = 0; i < sidebar.length; i++) {
    const item = sidebar[i];
    if (item.url === pathname) {
      return { next: sidebar[i + 1], prev: sidebar[i - 1] };
    }
  }

  return null;
}
