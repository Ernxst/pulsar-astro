/**
 *
 * @param {string} code
 * @returns
 */
export function isLanguageCode(code) {
  try {
    return Intl.DisplayNames.supportedLocalesOf([code]).includes(code);
  } catch {
    return false;
  }
}

/**
 * @param {string} pathname
 */
export function getLangFromPathname(pathname) {
  const [first, second] = pathname.split("/").filter(Boolean);
  const urlLocale = isLanguageCode(first) ? first : second;
  return isLanguageCode(urlLocale) ? urlLocale : undefined;
}
