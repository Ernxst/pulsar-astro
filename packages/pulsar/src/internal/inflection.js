import { titleize } from "inflection";

/**
 * A re-export of the `titleize` function from the `inflection` package.
 *
 * Needed because the Pulsar `docs` package has no build step and so will
 * not be able to import from `inflection` directly without the consumer
 * having to install it.
 */

/**
 * @param {string} str
 * @internal
 */
export function titelise(str) {
  return titleize(str);
}
