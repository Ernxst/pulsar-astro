import { describe, expect, test } from "vitest";
import { usePrevNext } from "./usePrevNext";

describe("usePrevNext", () => {
  describe("With a previous and next page", () => {
    /**
     * @type {import("../LeftSidebar/sidebar").Sidebar}
     */
    const sidebar = {
      introduction: {
        title: "Introduction",
        url: "/docs/introduction",
        children: {
          installation: {
            title: "Installation",
            url: "/docs/introduction/installation",
            children: {},
          },
        },
      },
      "getting-started": {
        title: "Getting Started",
        url: "/docs/introduction/getting-started",
        children: {},
      },
    };

    test("should return correct pagination options", () => {
      const pagination = usePrevNext(
        `/docs/introduction/installation`,
        sidebar
      );

      expect(pagination).toEqual({
        next: {
          title: "Getting Started",
          children: expect.any(Object),
          url: "/docs/introduction/getting-started",
        },
        prev: {
          title: "Introduction",
          url: "/docs/introduction",
          children: expect.any(Object),
        },
      });
    });
  });

  describe("With a previous page", () => {
    /**
     * @type {import("../LeftSidebar/sidebar").Sidebar}
     */
    const sidebar = {
      introduction: {
        title: "Introduction",
        url: "/docs/introduction",
        children: {
          installation: {
            title: "Installation",
            url: "/docs/introduction/installation",
            children: {},
          },
        },
      },
    };

    test("should return correct pagination options", () => {
      const pagination = usePrevNext(
        `/docs/introduction/installation`,
        sidebar
      );

      expect(pagination).toEqual({
        next: undefined,
        prev: {
          title: "Introduction",
          url: "/docs/introduction",
          children: expect.any(Object),
        },
      });
    });
  });

  describe("With a next page", () => {
    /**
     * @type {import("../LeftSidebar/sidebar").Sidebar}
     */
    const sidebar = {
      introduction: {
        title: "Introduction",
        url: "/docs/introduction",
        children: {
          installation: {
            title: "Installation",
            url: "/docs/introduction/installation",
            children: {},
          },
        },
      },
    };

    test("should return correct pagination options", () => {
      const pagination = usePrevNext(`/docs/introduction`, sidebar);

      expect(pagination).toEqual({
        next: {
          title: "Installation",
          url: "/docs/introduction/installation",
          children: expect.any(Object),
        },
        prev: undefined,
      });
    });
  });

  describe("With no previous or next page", () => {
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

    test("should return correct pagination options", () => {
      const pagination = usePrevNext(`/docs/introduction`, sidebar);

      expect(pagination).toEqual({
        next: undefined,
        prev: undefined,
      });
    });
  });

  describe("With a page that is not the current page", () => {
    /**
     * @type {import("../LeftSidebar/sidebar").Sidebar}
     */
    const sidebar = {
      introduction: {
        title: "Introduction",
        url: "/docs/introduction",
        children: {
          installation: {
            title: "Installation",
            url: "/docs/introduction/installation",
            children: {},
          },
        },
      },
      "getting-started": {
        title: "Getting Started",
        url: "/docs/introduction/getting-started",
        children: {},
      },
    };

    test("should return null", () => {
      const pagination = usePrevNext(`/docs/404`, sidebar);
      expect(pagination).toEqual(null);
    });
  });
});
