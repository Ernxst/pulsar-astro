import { describe, expect, test } from "vitest";
import { useBreadcrumbs } from "./useBreadcrumbs";

describe("useBreadcrumbs", () => {
  describe("Without a language code", () => {
    describe("With a single top-level section", () => {
      /**
       * @type {import("../LeftSidebar/sidebar").Sidebar}
       */
      const sidebar = {
        introduction: {
          title: "Introduction",
          url: "/docs/introduction",
          children: {},
        },
      };

      test("should build the breadcrumb correctly", () => {
        const crumbs = useBreadcrumbs("/docs/introduction", sidebar, "docs");

        expect(crumbs).toEqual([
          {
            title: "Docs",
            url: "/docs",
          },
          {
            title: "Introduction",
            url: "/docs/introduction",
          },
        ]);
      });
    });

    describe("With a single nested section", () => {
      /**
       * @type {import("../LeftSidebar/sidebar").Sidebar}
       */
      const sidebar = {
        introduction: {
          title: "Introduction",
          url: "/docs/introduction",
          children: {
            "getting-started": {
              title: "Getting Started",
              url: "/docs/introduction/getting-started",
              children: {},
            },
          },
        },
      };

      test("should build the breadcrumb correctly", () => {
        const crumbs = useBreadcrumbs(
          "/docs/introduction/getting-started",
          sidebar,
          "docs"
        );

        expect(crumbs).toEqual([
          {
            title: "Docs",
            url: "/docs",
          },
          {
            title: "Introduction",
            url: "/docs/introduction",
          },
          {
            title: "Getting Started",
            url: "/docs/introduction/getting-started",
          },
        ]);
      });
    });

    describe("With a deeply nested section", () => {
      test("should build the breadcrumb correctly", () => {
        /**
         * @type {import("../LeftSidebar/sidebar").Sidebar}
         */
        const sidebar = {
          introduction: {
            title: "Introduction",
            url: "/docs/introduction",
            children: {
              "getting-started": {
                title: "Getting Started",
                url: "/docs/introduction/getting-started",
                children: {
                  installation: {
                    title: "Installation",
                    url: "/docs/introduction/getting-started/installation",
                    children: {},
                  },
                },
              },
            },
          },
        };

        const crumbs = useBreadcrumbs(
          "/docs/introduction/getting-started/installation",
          sidebar,
          "docs"
        );

        expect(crumbs).toEqual([
          {
            title: "Docs",
            url: "/docs",
          },
          {
            title: "Introduction",
            url: "/docs/introduction",
          },
          {
            title: "Getting Started",
            url: "/docs/introduction/getting-started",
          },
          {
            title: "Installation",
            url: "/docs/introduction/getting-started/installation",
          },
        ]);
      });
    });

    describe("With a deeply nested where some are not links", () => {
      /**
       * @type {import("../LeftSidebar/sidebar").Sidebar}
       */
      const sidebar = {
        introduction: {
          title: "Introduction",
          url: "/docs/introduction",
          children: {
            "getting-started": {
              title: "Getting Started",
              url: undefined,
              children: {
                installation: {
                  title: "Installation",
                  url: "/docs/introduction/getting-started/installation",

                  children: {},
                },
              },
            },
          },
        },
      };

      test("should build the breadcrumb correctly", () => {
        const crumbs = useBreadcrumbs(
          "/docs/introduction/getting-started/installation",
          sidebar,
          "docs"
        );

        expect(crumbs).toEqual([
          {
            title: "Docs",
            url: "/docs",
          },
          {
            title: "Introduction",
            url: "/docs/introduction",
          },
          {
            title: "Getting Started",
            url: undefined,
          },
          {
            title: "Installation",
            url: "/docs/introduction/getting-started/installation",
          },
        ]);
      });
    });
  });

  describe("With a language code", () => {
    describe("With a single top-level section", () => {
      /**
       * @type {import("../LeftSidebar/sidebar").Sidebar}
       */
      const sidebar = {
        introduction: {
          title: "Introduction",
          url: "/docs/en/introduction",
          children: {},
        },
      };

      test("should build the breadcrumb correctly", () => {
        const crumbs = useBreadcrumbs("/docs/en/introduction", sidebar, "docs");

        expect(crumbs).toEqual([
          {
            title: "Docs",
            url: "/docs/en",
          },
          {
            title: "Introduction",
            url: "/docs/en/introduction",
          },
        ]);
      });
    });

    describe("With a single nested section", () => {
      /**
       * @type {import("../LeftSidebar/sidebar").Sidebar}
       */
      const sidebar = {
        introduction: {
          title: "Introduction",
          url: "/docs/en/introduction",
          children: {
            "getting-started": {
              title: "Getting Started",
              url: "/docs/en/introduction/getting-started",
              children: {},
            },
          },
        },
      };

      test("should build the breadcrumb correctly", () => {
        const crumbs = useBreadcrumbs(
          "/docs/en/introduction/getting-started",
          sidebar,
          "docs"
        );

        expect(crumbs).toEqual([
          {
            title: "Docs",
            url: "/docs/en",
          },
          {
            title: "Introduction",
            url: "/docs/en/introduction",
          },
          {
            title: "Getting Started",
            url: "/docs/en/introduction/getting-started",
          },
        ]);
      });
    });

    describe("With a deeply nested section", () => {
      test("should build the breadcrumb correctly", () => {
        /**
         * @type {import("../LeftSidebar/sidebar").Sidebar}
         */
        const sidebar = {
          introduction: {
            title: "Introduction",
            url: "/docs/en/introduction",
            children: {
              "getting-started": {
                title: "Getting Started",
                url: "/docs/en/introduction/getting-started",
                children: {
                  installation: {
                    title: "Installation",
                    url: "/docs/en/introduction/getting-started/installation",
                    children: {},
                  },
                },
              },
            },
          },
        };

        const crumbs = useBreadcrumbs(
          "/docs/en/introduction/getting-started/installation",
          sidebar,
          "docs"
        );

        expect(crumbs).toEqual([
          {
            title: "Docs",
            url: "/docs/en",
          },
          {
            title: "Introduction",
            url: "/docs/en/introduction",
          },
          {
            title: "Getting Started",
            url: "/docs/en/introduction/getting-started",
          },
          {
            title: "Installation",
            url: "/docs/en/introduction/getting-started/installation",
          },
        ]);
      });
    });

    describe("With a deeply nested where some are not links", () => {
      /**
       * @type {import("../LeftSidebar/sidebar").Sidebar}
       */
      const sidebar = {
        introduction: {
          title: "Introduction",
          url: "/docs/en/introduction",
          children: {
            "getting-started": {
              title: "Getting Started",
              url: undefined,
              children: {
                installation: {
                  title: "Installation",
                  url: "/docs/en/introduction/getting-started/installation",

                  children: {},
                },
              },
            },
          },
        },
      };

      test("should build the breadcrumb correctly", () => {
        const crumbs = useBreadcrumbs(
          "/docs/en/introduction/getting-started/installation",
          sidebar,
          "docs"
        );

        expect(crumbs).toEqual([
          {
            title: "Docs",
            url: "/docs/en",
          },
          {
            title: "Introduction",
            url: "/docs/en/introduction",
          },
          {
            title: "Getting Started",
            url: undefined,
          },
          {
            title: "Installation",
            url: "/docs/en/introduction/getting-started/installation",
          },
        ]);
      });
    });
  });
});
