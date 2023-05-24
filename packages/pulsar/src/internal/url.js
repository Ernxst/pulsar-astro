/**
 * @param {string} url
 * @internal
 */
export function formatUrl(url) {
  const protocolIndex = url.indexOf("://");
  let formattedUrl = url;

  if (protocolIndex !== -1) {
    const protocol = url.substring(0, protocolIndex + 3);
    const restOfUrl = url.substring(protocolIndex + 3);
    const replacedUrl = restOfUrl.replace(/\/\//g, "/");
    formattedUrl = protocol + replacedUrl;
  } else {
    formattedUrl = url.replace(/\/\//g, "/");
  }

  return formattedUrl.replace(/\/$/, "");
}
