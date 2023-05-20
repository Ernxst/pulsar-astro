import { z } from "zod";

const ContributorSchema = z.object({
  author: z.object({
    date: z.string(),
  }),
});

const Schema = z.object({
  commit: ContributorSchema.optional(),
});

const GitHubApiResponseSchema = z.array(Schema);

/**
 * @param {string} url
 */
export function formatUrl(url) {
  return url.replaceAll("//", "/");
}

/**
 * @param {string} url
 */
function extractRepo(url) {
  const regex = /github\.com\/([^\/]+\/[^\/]+)(?:\/|$)/;
  const match = url.match(regex);

  if (match) return match[1];
  throw new Error(`Could not extract repo from URL: ${url}`);
}

/**
 * @param {string} url
 * @param {string} filepath
 */
function resolveFilePath(url, filepath) {
  const regex = /github\.com\/[^\/]+\/[^\/]+\/tree\/[^\/]+\/(.+)/;
  const match = url.match(regex);

  if (match) {
    const directoryName = match[1];
    return formatUrl(`/${directoryName}/${filepath}`);
  }

  return formatUrl(`/${filepath}`);
}

/**
 * @typedef {Object} FetchOptions
 * @property {string} file
 * @property {string} token GitHub token used for escaping rate-limiting
 * @property {string} repoUrl GitHub repository URL
 */

/**
 * Fetch the last commit date for a given file to use as the
 * last updated date on the corresponding page
 *
 * @param {FetchOptions} options
 */
export async function getLastUpdatedDate(options) {
  const { file, token, repoUrl } = options;
  const repo = extractRepo(repoUrl);
  const filePath = resolveFilePath(repoUrl, file);

  const url = new URL(`https://api.github.com/repos/${repo}/commits`);
  url.searchParams.append("path", filePath);
  url.searchParams.append("per_page", "1");

  const commits = await githubGet({
    url,
    schema: GitHubApiResponseSchema,
    token,
  });

  if (commits.length > 0) {
    const lastCommit = commits[0];
    const dateStr = lastCommit.commit?.author.date;
    if (dateStr) return new Date(dateStr);
  }

  return null;
}

/**
 * @template {z.ZodTypeAny} T
 * @typedef {Object} GithubFetchOptions
 * @property {T} schema
 * @property {string | URL} url;
 * @property {string} token;
 */

/**
 * @param  {GithubFetchOptions<TSchema>} options
 * @template {z.ZodTypeAny} TSchema
 * @returns {Promise<z.infer<TSchema>>}
 */
export async function githubGet(options) {
  const { token, url, schema } = options;
  if (!token) {
    throw new Error(
      'Cannot find "PUBLIC_GITHUB_TOKEN" used for escaping rate-limiting.'
    );
  }

  const res = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/vnd.github.v3+json",
      Authorization: `token ${token}`,
    },
  });

  const json = await res.json();

  if (res.ok === false) {
    const msg = `GitHub API call failed: GET "${url.toString()}" returned status ${
      res.status
    }:\n${JSON.stringify(json, null, 2)}`;

    throw new Error(msg);
  }

  return schema.parse(json);
}
