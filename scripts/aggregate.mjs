#!/usr/bin/env node
import fs from "fs";
import path from "path";

// Target coverage file in each monorepo package/app
const COVERAGE_FILENAME = "coverage-final.json";

// Directories to exclude from traversal
const EXCLUDED_DIRECTORIES = new Set([
  "node_modules",
  "src",
  "test",
  "tests",
  "__tests__",
  "__test__",
  "dist",
  ".turbo",
  ".DS_Store",
  ".husky",
  ".github",
  ".changeset",
  ".vscode",
  ".nyc_output",
  "scripts",
  "env",
]);

/**
 *  Copies all coverage reports from the "packages" and "apps" directories in
 * the monorepo root to the `outputDir` directory in the root, renaming each
 * report to the name of the package it came from.
 *
 * It ignores several directories where it is known that coverage files cannot
 * be located in.
 *
 * @param {string} root - The root directory of the monorepo
 * @param {string} outputDir - The directory to output the copied and renamed coverage reports
 * @param {string} packagesDir - The directory where the packages are located
 */
async function copyCoverageReports(root, outputDir, packagesDir) {
  // Find all the coverage reports in the packages and apps directories and
  // create the output directory - all concurrently for maximum performance
  const [packageCoverageReports] = await Promise.all([
    await findCoverageReports(path.join(root, packagesDir)),
    await fs.promises.mkdir(outputDir, { recursive: true }),
  ]);

  // Combine all reports
  const reports = [...packageCoverageReports];

  // Copy and rename each report, performing file system operations concurrently
  await Promise.all(
    reports.map(async (report) => {
      // Last segment is the filename, penultimate is `coverage/` so the
      // package name is the third from last segment in the file path
      const packageName = report.split(path.sep).at(-3);
      const extension = path.extname(report);
      const outputPath = path.join(outputDir, `${packageName}${extension}`);
      await fs.promises.copyFile(report, outputPath);
    })
  );
}

/**
 * @param {string} dir - The directory to search for coverage reports
 * @returns {Promise<string[]>} - The paths of the found coverage reports
 */
async function findCoverageReports(dir) {
  const reports = [];

  // Read the directory contents
  const contents = await fs.promises.readdir(dir, { withFileTypes: true });

  // Perform file system operations concurrently for maximum performance
  await Promise.all(
    contents.map(async (item) => {
      const name = item.name;

      if (EXCLUDED_DIRECTORIES.has(name)) return;

      if (item.isDirectory()) {
        // Traverse directory to check for coverage reports we need to copy
        const itemPath = path.join(dir, name);
        reports.push(...(await findCoverageReports(itemPath)));
      } else if (name === COVERAGE_FILENAME) {
        // We've found a coverage report - add it to the array
        const itemPath = path.join(dir, name);
        reports.push(itemPath);
      }
    })
  );

  return reports;
}

const label = "Aggregated all coverage reports in";
console.time(label);
copyCoverageReports(process.cwd(), ".nyc_output", "packages").then(() => {
  console.timeEnd(label);
});
