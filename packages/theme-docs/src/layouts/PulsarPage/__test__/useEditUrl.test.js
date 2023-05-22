import { describe, expect, test } from "vitest";
import { useEditUrl } from "../lib";

describe("useEditUrl", () => {
  describe("With editInGitHub set to false", () => {
    test("should return null", () => {
      const editUrl = useEditUrl({
        siteConfig: {
          repositories: {
            project: { url: "some-url" },
          },
        },
        pageCollection: {
          collection: "pages",
          id: "some-id",
          data: { type: "docs", editInGitHub: false },
        },
      });

      expect(editUrl).toBeNull();
    });
  });

  describe("With no project or documentation repository", () => {
    test("should return null", () => {
      const editUrl = useEditUrl({
        siteConfig: {
          repositories: {},
        },
        pageCollection: {
          collection: "pages",
          id: "some-id",
          data: { type: "docs", editInGitHub: true },
        },
      });

      expect(editUrl).toBeNull();
    });
  });

  describe("With a collection entry used in a page subdirectory of the same name", () => {
    test("should return the correct github url", () => {
      const editUrl = useEditUrl({
        siteConfig: {
          repositories: {
            project: { url: "https://github.com/owner/repo" },
          },
        },
        pageCollection: {
          collection: "docs",
          id: "en/overview/core-concepts.md",
          data: { type: "docs", editInGitHub: true },
        },
      });

      expect(editUrl).toBe(
        "https://github.com/owner/repo/edit/main/packages/theme-docs/src/content/docs/en/overview/core-concepts.md"
      );
    });
  });

  describe("With a collection entry used in a page subdirectory of a different name", () => {
    test("should return the correct github url", () => {
      const editUrl = useEditUrl({
        siteConfig: {
          repositories: {
            project: { url: "https://github.com/owner/repo" },
          },
        },
        pageCollection: {
          collection: "docs",
          id: "en/overview/core-concepts.md",
          data: { type: "docs", editInGitHub: true },
        },
      });

      expect(editUrl).toBe(
        "https://github.com/owner/repo/edit/main/packages/theme-docs/src/content/docs/en/overview/core-concepts.md"
      );
    });
  });

  describe("With a collection entry used at the root of the site", () => {
    test("should return the correct github url", () => {
      const editUrl = useEditUrl({
        siteConfig: {
          repositories: {
            project: { url: "https://github.com/owner/repo" },
          },
        },
        pageCollection: {
          collection: "docs",
          id: "en/overview/core-concepts.md",
          data: { type: "docs", editInGitHub: true },
        },
      });

      expect(editUrl).toBe(
        "https://github.com/owner/repo/edit/main/packages/theme-docs/src/content/docs/en/overview/core-concepts.md"
      );
    });
  });

  describe("With a custom docs repository", () => {
    test("should return the correct github url", () => {
      const editUrl = useEditUrl({
        siteConfig: {
          repositories: {
            documentation: { url: "https://github.com/owner/repo" },
          },
        },
        pageCollection: {
          collection: "docs",
          id: "en/overview/core-concepts.md",
          data: { type: "docs", editInGitHub: true },
        },
      });

      expect(editUrl).toBe(
        "https://github.com/owner/repo/edit/main/packages/theme-docs/src/content/docs/en/overview/core-concepts.md"
      );
    });
  });
});
