import { dirname, join, relative } from "node:path";
import fs from "node:fs";
import { simpleGit } from "simple-git";
import { useCWD } from "../util.js";

/**
 * @param {string} currentDir
 * @param {number} depth
 * @returns {string | null}
 */
function findNearestGitDirectory(currentDir = useCWD(), depth = 0) {
  const gitDirPath = join(currentDir, ".git");

  if (fs.existsSync(gitDirPath) && fs.lstatSync(gitDirPath).isDirectory()) {
    return currentDir;
  }

  if (depth >= 5) return null;

  const parentDir = dirname(currentDir);
  if (parentDir === currentDir) return null;

  return findNearestGitDirectory(parentDir, depth + 1);
}

export class PulsarRepository {
  /**
   * @type {import("simple-git").SimpleGit}
   */
  repo;

  /**
   * @type {string}
   */
  rootDir;

  /**
   *
   * @param {string | undefined | null} dir
   */
  constructor(dir = findNearestGitDirectory()) {
    if (!dir) {
      throw new Error("Could not find a git directory");
    }

    this.rootDir = dir;
    this.repo = simpleGit(dir);
  }

  root() {
    return this.rootDir;
  }

  async branchName() {
    const [remote] = await this.repo.getRemotes();
    const branch = await this.repo.branch(["-r", "--list", `${remote.name}/*`]);
    const [branchName] = branch.all;
    return branchName.replace(`${remote.name}/`, "");
  }

  /**
   * @param {string} relativePath
   */
  relativeToRoot(relativePath) {
    const pulsarRoot = useCWD();
    const relativeAstroRoot = join(pulsarRoot, relativePath);
    const workspaceRoot = this.root();
    return relative(workspaceRoot, relativeAstroRoot);
  }

  /**
   * Fetch the last commit date for a given file to use as the
   * last updated date on the corresponding page
   *
   * @param {string} file
   */
  async getLastUpdatedDate(file) {
    const relative = this.relativeToRoot(file);
    const result = await this.repo.log({ file: relative, maxCount: 1 });

    const date = result.latest?.date;
    if (date) {
      return new Date(date);
    }

    return null;
  }
}
