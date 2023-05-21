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
