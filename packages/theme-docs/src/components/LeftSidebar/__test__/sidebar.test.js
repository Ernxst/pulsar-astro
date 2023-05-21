import path from "node:path";
import { titleize } from "inflection";
import { describe, expect, test } from "vitest";
import { useSidebar } from "../sidebar";

/**
 * @param {string} filePath
 */
function mockMarkdownFile(filePath) {
  const baseName = path.basename(filePath, path.extname(filePath));
  const depth = filePath.split("/").length - 1;
  return {
    file: filePath,
    getHeadings: () => [
      { slug: baseName, text: titleize(baseName.replace("-", "_")), depth },
    ],
  };
}

describe("sidebar.js", () => {
  describe("With a single top-level markdown file", () => {
    const mdFiles = [mockMarkdownFile("/src/content/docs/en/introduction.md")];

    test("should return correct sidebar sections", () => {
      const sections = useSidebar(mdFiles);
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
    const mdFiles = [mockMarkdownFile("/src/content/docs/en/index.md")];

    test("should return correct sidebar sections", () => {
      const sections = useSidebar(mdFiles);
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
      mockMarkdownFile("/src/content/docs/en/introduction.md"),
      mockMarkdownFile("/src/content/docs/en/getting-started.md"),
    ];

    test("should return correct sidebar sections", () => {
      const sections = useSidebar(mdFiles);
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
    const mdFiles = [
      mockMarkdownFile("/src/content/docs/en/getting-started/index.md"),
    ];

    test("should return correct sidebar sections", () => {
      const sections = useSidebar(mdFiles);
      expect(sections).toEqual({
        "getting-started": {
          title: "Getting Started",
          url: undefined,
          children: {
            index: {
              title: "Index",
              url: "/docs/en/getting-started",
              children: {},
            },
          },
        },
      });
    });
  });

  describe("With multiple markdown files in a subdirectory", () => {
    const mdFiles = [
      mockMarkdownFile("/src/content/docs/en/getting-started/index.md"),
      mockMarkdownFile("/src/content/docs/en/getting-started/installation.md"),
    ];

    test("should return correct sidebar sections", () => {
      const sections = useSidebar(mdFiles);
      expect(sections).toEqual({
        "getting-started": {
          title: "Getting Started",
          url: undefined,
          children: {
            index: {
              title: "Index",
              url: "/docs/en/getting-started",
              children: {},
            },
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
      mockMarkdownFile("/src/content/docs/en/getting-started/index.md"),
      mockMarkdownFile("/src/content/docs/en/getting-started/installation.md"),
      mockMarkdownFile("/src/content/docs/en/getting-started/usage.md"),
      mockMarkdownFile("/src/content/docs/en/advanced/index.md"),
      mockMarkdownFile("/src/content/docs/en/advanced/recipes.md"),
    ];

    test("should return correct sidebar sections", () => {
      const sections = useSidebar(mdFiles);
      expect(sections).toEqual({
        "getting-started": {
          title: "Getting Started",
          url: undefined,
          children: {
            index: {
              title: "Index",
              url: "/docs/en/getting-started",
              children: {},
            },
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
          url: undefined,
          children: {
            index: {
              title: "Index",
              url: "/docs/en/advanced",
              children: {},
            },
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
      mockMarkdownFile("/src/content/docs/en/getting-started/index.md"),
      mockMarkdownFile("/src/content/docs/en/getting-started/installation.md"),
      mockMarkdownFile("/src/content/docs/en/getting-started/usage.md"),
      mockMarkdownFile("/src/content/docs/en/advanced/index.md"),
      mockMarkdownFile("/src/content/docs/en/advanced/usage.md"),
    ];

    test("should return correct sidebar sections", () => {
      const sections = useSidebar(mdFiles);
      expect(sections).toEqual({
        "getting-started": {
          title: "Getting Started",
          url: undefined,
          children: {
            index: {
              title: "Index",
              url: "/docs/en/getting-started",
              children: {},
            },
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
          url: undefined,
          children: {
            index: {
              title: "Index",
              url: "/docs/en/advanced",
              children: {},
            },
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
      mockMarkdownFile(
        "/src/content/docs/en/getting-started/deeply/nested/usage.md"
      ),
    ];

    test("should return correct sidebar sections", () => {
      const sections = useSidebar(mdFiles);
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
      mockMarkdownFile("/src/content/docs/en/index.md"),
      mockMarkdownFile("/src/content/docs/en/getting-started/index.md"),
      mockMarkdownFile("/src/content/docs/en/getting-started/installation.md"),
      mockMarkdownFile("/src/content/docs/en/getting-started/usage.md"),
      mockMarkdownFile("/src/content/docs/en/advanced/index.md"),
      mockMarkdownFile("/src/content/docs/en/advanced/usage.md"),
      mockMarkdownFile("/src/content/docs/en/advanced/recipes/index.md"),
      mockMarkdownFile("/src/content/docs/en/advanced/recipes/recipe-1.md"),
      mockMarkdownFile("/src/content/docs/en/advanced/recipes/recipe-2.md"),
      mockMarkdownFile("/src/content/docs/en/advanced/recipes/recipe-3.md"),
    ];

    test("should return correct sidebar sections", () => {
      const sections = useSidebar(mdFiles);
      expect(sections).toEqual({
        index: {
          title: "Index",
          url: "/docs/en",
          children: {},
        },
        "getting-started": {
          title: "Getting Started",
          url: undefined,
          children: {
            index: {
              title: "Index",
              url: "/docs/en/getting-started",
              children: {},
            },
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
          url: undefined,
          children: {
            index: {
              title: "Index",
              url: "/docs/en/advanced",
              children: {},
            },
            usage: {
              title: "Usage",
              url: "/docs/en/advanced/usage",
              children: {},
            },
            recipes: {
              title: "Recipes",
              url: undefined,
              children: {
                index: {
                  title: "Index",
                  url: "/docs/en/advanced/recipes",
                  children: {},
                },
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
