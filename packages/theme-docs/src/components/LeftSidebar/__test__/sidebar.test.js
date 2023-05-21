import path from "node:path";
import { titleize } from "inflection";
import { describe, expect, test } from "vitest";
import { useSidebar } from "../sidebar";

/**
 * @param {string} slug
 * @returns MarkdownFile
 */
function mockMarkdownFile(slug) {
  const baseName = path.basename(slug, path.extname(slug));
  return {
    slug,
    headings: [titleize(baseName.replaceAll("-", "_"))],
  };
}

describe("sidebar.js", () => {
  describe("Without a lang code", () => {
    describe("With a single markdown file in a subdirectory", () => {
      const mdFiles = [mockMarkdownFile("/getting-started/index")];

      test("should return correct sidebar sections", () => {
        const sections = useSidebar(mdFiles, "/docs");
        expect(sections).toEqual({
          "getting-started": {
            title: "Getting Started",
            url: "/docs/getting-started",
            children: {},
          },
        });
      });
    });

    describe("With a complex directory structure", () => {
      const mdFiles = [
        mockMarkdownFile("/index"),
        mockMarkdownFile("/getting-started/index"),
        mockMarkdownFile("/getting-started/installation"),
        mockMarkdownFile("/getting-started/usage"),
        mockMarkdownFile("/advanced/index"),
        mockMarkdownFile("/advanced/usage"),
        mockMarkdownFile("/advanced/recipes/index"),
        mockMarkdownFile("/advanced/recipes/recipe-1"),
        mockMarkdownFile("/advanced/recipes/recipe-2"),
        mockMarkdownFile("/advanced/recipes/recipe-3"),
      ];

      test("should return correct sidebar sections", () => {
        const sections = useSidebar(mdFiles, "/docs");
        expect(sections).toEqual({
          index: {
            title: "Index",
            url: "/docs",
            children: {},
          },
          "getting-started": {
            title: "Getting Started",
            url: "/docs/getting-started",
            children: {
              installation: {
                title: "Installation",
                url: "/docs/getting-started/installation",
                children: {},
              },
              usage: {
                title: "Usage",
                url: "/docs/getting-started/usage",
                children: {},
              },
            },
          },
          advanced: {
            title: "Advanced",
            url: "/docs/advanced",
            children: {
              usage: {
                title: "Usage",
                url: "/docs/advanced/usage",
                children: {},
              },
              recipes: {
                title: "Recipes",
                url: "/docs/advanced/recipes",
                children: {
                  "recipe-1": {
                    title: "Recipe 1",
                    url: "/docs/advanced/recipes/recipe-1",
                    children: {},
                  },
                  "recipe-2": {
                    title: "Recipe 2",
                    url: "/docs/advanced/recipes/recipe-2",
                    children: {},
                  },
                  "recipe-3": {
                    title: "Recipe 3",
                    url: "/docs/advanced/recipes/recipe-3",
                    children: {},
                  },
                },
              },
            },
          },
        });
      });
    });
  });

  describe("With a lang code", () => {
    describe("With a single top-level markdown file", () => {
      const mdFiles = [mockMarkdownFile("/en/introduction")];

      test("should return correct sidebar sections", () => {
        const sections = useSidebar(mdFiles, "/docs");
        expect(sections).toEqual({
          introduction: {
            title: "Introduction",
            url: "/docs/en/introduction",
            children: {},
          },
        });
      });
    });

    describe("With a single top-level index markdown file", () => {
      const mdFiles = [mockMarkdownFile("/en/index")];

      test("should return correct sidebar sections", () => {
        const sections = useSidebar(mdFiles, "/docs");
        expect(sections).toEqual({
          index: {
            title: "Index",
            url: "/docs/en",
            children: {},
          },
        });
      });
    });

    describe("With multiple top-level markdown files", () => {
      const mdFiles = [
        mockMarkdownFile("/en/introduction"),
        mockMarkdownFile("/en/getting-started"),
      ];

      test("should return correct sidebar sections", () => {
        const sections = useSidebar(mdFiles, "/docs");
        expect(sections).toEqual({
          introduction: {
            title: "Introduction",
            url: "/docs/en/introduction",
            children: {},
          },
          "getting-started": {
            title: "Getting Started",
            url: "/docs/en/getting-started",
            children: {},
          },
        });
      });
    });

    describe("With a single markdown file in a subdirectory", () => {
      const mdFiles = [mockMarkdownFile("/en/getting-started/index")];

      test("should return correct sidebar sections", () => {
        const sections = useSidebar(mdFiles, "/docs");
        expect(sections).toEqual({
          "getting-started": {
            title: "Getting Started",
            url: "/docs/en/getting-started",
            children: {},
          },
        });
      });
    });

    describe("With multiple markdown files in a subdirectory", () => {
      const mdFiles = [
        mockMarkdownFile("/en/getting-started/index"),
        mockMarkdownFile("/en/getting-started/installation"),
      ];

      test("should return correct sidebar sections", () => {
        const sections = useSidebar(mdFiles, "/docs");
        expect(sections).toEqual({
          "getting-started": {
            title: "Getting Started",
            url: "/docs/en/getting-started",
            children: {
              installation: {
                title: "Installation",
                url: "/docs/en/getting-started/installation",
                children: {},
              },
            },
          },
        });
      });
    });

    describe("With multiple markdown files in multiple subdirectories", () => {
      const mdFiles = [
        mockMarkdownFile("/en/getting-started/index"),
        mockMarkdownFile("/en/getting-started/installation"),
        mockMarkdownFile("/en/getting-started/usage"),
        mockMarkdownFile("/en/advanced/index"),
        mockMarkdownFile("/en/advanced/recipes"),
      ];

      test("should return correct sidebar sections", () => {
        const sections = useSidebar(mdFiles, "/docs");
        expect(sections).toEqual({
          "getting-started": {
            title: "Getting Started",
            url: "/docs/en/getting-started",
            children: {
              installation: {
                title: "Installation",
                url: "/docs/en/getting-started/installation",
                children: {},
              },
              usage: {
                title: "Usage",
                url: "/docs/en/getting-started/usage",
                children: {},
              },
            },
          },
          advanced: {
            title: "Advanced",
            url: "/docs/en/advanced",
            children: {
              recipes: {
                title: "Recipes",
                url: "/docs/en/advanced/recipes",
                children: {},
              },
            },
          },
        });
      });
    });

    describe("With multiple markdown files in multiple subdirectories with the same name", () => {
      const mdFiles = [
        mockMarkdownFile("/en/getting-started/index"),
        mockMarkdownFile("/en/getting-started/installation"),
        mockMarkdownFile("/en/getting-started/usage"),
        mockMarkdownFile("/en/advanced/index"),
        mockMarkdownFile("/en/advanced/usage"),
      ];

      test("should return correct sidebar sections", () => {
        const sections = useSidebar(mdFiles, "/docs");
        expect(sections).toEqual({
          "getting-started": {
            title: "Getting Started",
            url: "/docs/en/getting-started",
            children: {
              installation: {
                title: "Installation",
                url: "/docs/en/getting-started/installation",
                children: {},
              },
              usage: {
                title: "Usage",
                url: "/docs/en/getting-started/usage",
                children: {},
              },
            },
          },
          advanced: {
            title: "Advanced",
            url: "/docs/en/advanced",
            children: {
              usage: {
                title: "Usage",
                url: "/docs/en/advanced/usage",
                children: {},
              },
            },
          },
        });
      });
    });

    describe("With a single markdown file in a deeply nested directory", () => {
      const mdFiles = [
        mockMarkdownFile("/en/getting-started/deeply/nested/usage"),
      ];

      test("should return correct sidebar sections", () => {
        const sections = useSidebar(mdFiles, "/docs");
        expect(sections).toEqual({
          "getting-started": {
            title: "Getting Started",
            url: undefined,
            children: {
              deeply: {
                title: "Deeply",
                url: undefined,
                children: {
                  nested: {
                    title: "Nested",
                    url: undefined,
                    children: {
                      usage: {
                        title: "Usage",
                        url: "/docs/en/getting-started/deeply/nested/usage",
                        children: {},
                      },
                    },
                  },
                },
              },
            },
          },
        });
      });
    });

    describe("With a complex directory structure", () => {
      const mdFiles = [
        mockMarkdownFile("/en/index"),
        mockMarkdownFile("/en/getting-started/index"),
        mockMarkdownFile("/en/getting-started/installation"),
        mockMarkdownFile("/en/getting-started/usage"),
        mockMarkdownFile("/en/advanced/index"),
        mockMarkdownFile("/en/advanced/usage"),
        mockMarkdownFile("/en/advanced/recipes/index"),
        mockMarkdownFile("/en/advanced/recipes/recipe-1"),
        mockMarkdownFile("/en/advanced/recipes/recipe-2"),
        mockMarkdownFile("/en/advanced/recipes/recipe-3"),
      ];

      test("should return correct sidebar sections", () => {
        const sections = useSidebar(mdFiles, "/docs");

        expect(sections).toEqual({
          index: {
            title: "Index",
            url: "/docs/en",
            children: {},
          },
          "getting-started": {
            title: "Getting Started",
            url: "/docs/en/getting-started",
            children: {
              installation: {
                title: "Installation",
                url: "/docs/en/getting-started/installation",
                children: {},
              },
              usage: {
                title: "Usage",
                url: "/docs/en/getting-started/usage",
                children: {},
              },
            },
          },
          advanced: {
            title: "Advanced",
            url: "/docs/en/advanced",
            children: {
              usage: {
                title: "Usage",
                url: "/docs/en/advanced/usage",
                children: {},
              },
              recipes: {
                title: "Recipes",
                url: "/docs/en/advanced/recipes",
                children: {
                  "recipe-1": {
                    title: "Recipe 1",
                    url: "/docs/en/advanced/recipes/recipe-1",
                    children: {},
                  },
                  "recipe-2": {
                    title: "Recipe 2",
                    url: "/docs/en/advanced/recipes/recipe-2",
                    children: {},
                  },
                  "recipe-3": {
                    title: "Recipe 3",
                    url: "/docs/en/advanced/recipes/recipe-3",
                    children: {},
                  },
                },
              },
            },
          },
        });
      });
    });
  });
});
