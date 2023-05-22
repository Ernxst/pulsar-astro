import { describe, expect, test } from "vitest";
import { useSidebar } from "../sidebar";
import { flattenSidebar, mockMarkdownFile, mockMeta } from "./test-lib";

describe("_meta.json", () => {
  describe("with no _meta.json files", () => {
    const mdFiles = [
      mockMarkdownFile("/en/app"),
      mockMarkdownFile("/en/index"),
    ];

    /**
     * @type {Record<string, import("src/config").MetaJson>}
     */
    const metaJsons = {};

    test("should generate sidebar in correct order", () => {
      const sidebar = useSidebar(mdFiles, "/docs", metaJsons);
      const flat = flattenSidebar(sidebar);

      expect(flat).toEqual([
        { title: "App", children: {}, url: "/docs/en/app" },
        { title: "Index", children: {}, url: "/docs/en" },
      ]);
    });
  });

  describe("with a _meta.json file at the root", () => {
    const mdFiles = [
      mockMarkdownFile("/en/app"),
      mockMarkdownFile("/en/index"),
    ];

    const metaJsons = {
      "/src/content/docs/en/_meta.json": mockMeta(["index", "app"]),
    };

    test("should generate sidebar in correct order", () => {
      const sidebar = useSidebar(mdFiles, "/docs", metaJsons);
      const flat = flattenSidebar(sidebar);

      expect(flat).toEqual([
        { title: "Index", children: {}, url: "/docs/en" },
        { title: "App", children: {}, url: "/docs/en/app" },
      ]);
    });
  });

  describe("with unspecified filenames in _meta.json", () => {
    const mdFiles = [
      mockMarkdownFile("/en/app"),
      mockMarkdownFile("/en/index"),
    ];

    const metaJsons = {
      "/en/_meta.json": mockMeta(["index", "app"]),
    };

    test("should generate sidebar in correct order", () => {
      const sidebar = useSidebar(mdFiles, "/docs", metaJsons);
      const flat = flattenSidebar(sidebar);

      expect(flat).toEqual([
        { title: "Index", children: {}, url: "/docs/en" },
        { title: "App", children: {}, url: "/docs/en/app" },
      ]);
    });
  });

  describe("with a _meta.json file in a subdirectory", () => {
    const mdFiles = [
      mockMarkdownFile("/en/app"),
      mockMarkdownFile("/en/index"),
      mockMarkdownFile("/en/subdir/another"),
      mockMarkdownFile("/en/subdir/one"),
    ];

    const metaJsons = {
      "/src/content/docs/en/_meta.json": mockMeta(["index", "app"]),
      "/src/content/docs/en/subdir/_meta.json": mockMeta(["one", "another"]),
    };

    test("should generate sidebar in correct order", () => {
      const sidebar = useSidebar(mdFiles, "/docs", metaJsons);
      const flat = flattenSidebar(sidebar);

      expect(flat).toEqual([
        { title: "Index", children: {}, url: "/docs/en" },
        { title: "App", children: {}, url: "/docs/en/app" },
        {
          title: "Subdir",
          children: expect.any(Object),
          url: undefined,
        },
        { title: "One", children: {}, url: "/docs/en/subdir/one" },
        { title: "Another", children: {}, url: "/docs/en/subdir/another" },
      ]);
    });
  });

  describe("With a complex directory structure", () => {
    const mdFiles = [
      mockMarkdownFile("/en/index"),
      mockMarkdownFile("/en/getting-started/index"),
      mockMarkdownFile("/en/getting-started/faq"),
      mockMarkdownFile("/en/getting-started/installation"),
      mockMarkdownFile("/en/getting-started/usage"),
      mockMarkdownFile("/en/advanced/index"),
      mockMarkdownFile("/en/advanced/usage"),
      mockMarkdownFile("/en/advanced/recipes/index"),
      mockMarkdownFile("/en/advanced/recipes/recipe-1"),
      mockMarkdownFile("/en/advanced/recipes/recipe-2"),
      mockMarkdownFile("/en/advanced/recipes/recipe-3"),
    ];

    const metas = {
      "/src/content/docs/en/_meta.json": mockMeta(["index", "getting-started"]),
      "/src/content/docs/en/getting-started/_meta.json": mockMeta([
        "installation",
        "faq",
      ]),
      "/src/content/docs/en/advanced/recipes/_meta.json": mockMeta([
        "recipe-2",
        "recipe-1",
      ]),
    };

    test("should return correct sidebar sections", () => {
      const sections = useSidebar(mdFiles, "/docs", metas);
      const flat = flattenSidebar(sections);

      expect(flat).toEqual([
        { title: "Index", children: expect.any(Object), url: "/docs/en" },
        {
          title: "Getting Started",
          children: expect.any(Object),
          url: "/docs/en/getting-started",
        },
        {
          title: "Installation",
          children: {},
          url: "/docs/en/getting-started/installation",
        },
        {
          title: "Faq",
          children: {},
          url: "/docs/en/getting-started/faq",
        },
        {
          title: "Usage",
          children: expect.any(Object),
          url: "/docs/en/getting-started/usage",
        },
        {
          title: "Advanced",
          children: expect.any(Object),
          url: "/docs/en/advanced",
        },
        {
          title: "Recipes",
          children: expect.any(Object),
          url: "/docs/en/advanced/recipes",
        },
        {
          title: "Recipe 2",
          children: {},

          url: "/docs/en/advanced/recipes/recipe-2",
        },
        {
          title: "Recipe 1",
          children: {},
          url: "/docs/en/advanced/recipes/recipe-1",
        },
        {
          title: "Recipe 3",
          children: {},
          url: "/docs/en/advanced/recipes/recipe-3",
        },
        // No _meta.json file for /en/advanced so it goes straight to the end
        {
          title: "Usage",
          children: {},
          url: "/docs/en/advanced/usage",
        },
      ]);
    });
  });
});
