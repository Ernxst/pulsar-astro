export const Lang = {
  /**
   * @param {string} code
   */
  isCode(code) {
    try {
      return Intl.DisplayNames.supportedLocalesOf([code]).includes(code);
    } catch {
      return false;
    }
  },

  /**
   * @param {string} pathname
   */
  fromPathname(pathname) {
    const [first, second] = pathname.split("/").filter(Boolean);
    const urlLocale = Lang.isCode(first) ? first : second;
    return Lang.isCode(urlLocale) ? urlLocale : undefined;
  },
};
