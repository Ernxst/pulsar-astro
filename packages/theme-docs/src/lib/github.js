import path from "node:path";
import { Repository } from "@napi-rs/simple-git";
import { useCWD } from "./util";

// See https://github.com/shuding/nextra/blob/73241b3fee58f0318e9349a5eb7650a7cd55a4e3/packages/nextra/src/loader.ts#L29
export function useRepository(dir = useCWD()) {
  const repository = Repository.discover(dir);
  const gitDir = repository.path();
  const workspaceRoot = path.join(gitDir, "..");

  return { repository, workspaceRoot };
}

/**
 * @param {string} relativePath
 * @returns
 */
export function resolveRelativeToRepoRoot(relativePath) {
  const pulsarRoot = useCWD();
  const relativeAstroRoot = path.join(pulsarRoot, relativePath);

  const { workspaceRoot } = useRepository(pulsarRoot);
  return path.relative(workspaceRoot, relativeAstroRoot);
}

/**
 * Fetch the last commit date for a given file to use as the
 * last updated date on the corresponding page
 *
 * @param {string} file
 */
export async function getLastUpdatedDate(file) {
  /**
   * Workspace root is the directory where the .git directory is located,
   * this will not be the same as the current working directory if the
   * Astro project is a subdirectory of the repository e.g., a monorepo
   */
  const { repository } = useRepository();

  // See https://github.com/shuding/nextra/blob/73241b3fee58f0318e9349a5eb7650a7cd55a4e3/packages/nextra/src/loader.ts#L29
  if (repository.isShallow()) {
    if (process.env.VERCEL) {
      console.warn(
        "[pulsar] The repository is shallow cloned, so the latest modified time will not be presented. Set the VERCEL_DEEP_CLONE=true environment variable to enable deep cloning."
      );
    } else if (process.env.GITHUB_ACTION) {
      console.warn(
        "[pulsar] The repository is shallow cloned, so the latest modified time will not be presented. See https://github.com/actions/checkout#fetch-all-history-for-all-tags-and-branches to fetch all the history."
      );
    } else {
      console.warn(
        "[pulsar] The repository is shallow cloned, so the latest modified time will not be presented."
      );
    }
  }

  const relative = resolveRelativeToRepoRoot(file);

  try {
    const date = repository.getFileLatestModifiedDate(relative);
    return new Date(date);
  } catch (err) {
    return null;
  }
}
