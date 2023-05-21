import { describe, expect, test } from "vitest";
import { usePagination } from "../lib";

describe("usePagination", () => {
  describe("With only site config", () => {
    describe("With site config pagination as boolean", () => {
      /**
       * @type {Pick<import("../../../config").PulsarDocsConfig, "pagination">}
       */
      const siteConfig = {
        pagination: true,
      };

      test("should return site config pagination options", () => {
        const { next, prev } = usePagination({ siteConfig, pageConfig: {} });

        expect(next).toBe(true);
        expect(prev).toBe(true);
      });
    });

    describe("With site config pagination as object", () => {
      /**
       * @type {Pick<import("../../../config").PulsarDocsConfig, "pagination">}
       */
      const siteConfig = {
        pagination: {
          next: true,
          prev: false,
        },
      };

      test("should return site config pagination options", () => {
        const { next, prev } = usePagination({ siteConfig, pageConfig: {} });

        expect(next).toBe(true);
        expect(prev).toBe(false);
      });
    });
  });

  describe("With only page config", () => {
    describe("With page config pagination as boolean", () => {
      /**
       * @type {Pick<import("../../../config").DocsPage, "pagination">}
       */
      const pageConfig = {
        pagination: true,
      };

      test("should return page config pagination options", () => {
        const { next, prev } = usePagination({ siteConfig: {}, pageConfig });

        expect(next).toBe(true);
        expect(prev).toBe(true);
      });
    });

    describe("With page config pagination as object", () => {
      /**
       * @type {Pick<import("../../../config").DocsPage, "pagination">}
       */
      const pageConfig = {
        pagination: {
          next: true,
          prev: false,
        },
      };

      test("should return page config pagination options", () => {
        const { next, prev } = usePagination({ siteConfig: {}, pageConfig });

        expect(next).toBe(true);
        expect(prev).toBe(false);
      });
    });
  });

  describe("With both site and page config", () => {
    describe("With page config pagination as boolean", () => {
      /**
       * @type {Pick<import("../../../config").DocsPage, "pagination">}
       */
      const pageConfig = {
        pagination: true,
      };

      describe("With site config pagination as boolean", () => {
        /**
         * @type {Pick<import("../../../config").PulsarDocsConfig, "pagination">}
         */
        const siteConfig = {
          pagination: true,
        };

        test("should return page config pagination options", () => {
          const { next, prev } = usePagination({ siteConfig, pageConfig });

          expect(next).toBe(true);
          expect(prev).toBe(true);
        });
      });

      describe("With site config pagination as object", () => {
        /**
         * @type {Pick<import("../../../config").PulsarDocsConfig, "pagination">}
         */
        const siteConfig = {
          pagination: {
            next: true,
            prev: false,
          },
        };

        test("should return page config pagination options", () => {
          const { next, prev } = usePagination({ siteConfig, pageConfig });

          expect(next).toBe(true);
          expect(prev).toBe(true);
        });
      });
    });

    describe("With page config pagination as object", () => {
      /**
       * @type {Pick<import("../../../config").DocsPage, "pagination">}
       */
      const pageConfig = {
        pagination: {
          next: true,
          prev: false,
        },
      };

      describe("With site config pagination as boolean", () => {
        /**
         * @type {Pick<import("../../../config").PulsarDocsConfig, "pagination">}
         */
        const siteConfig = {
          pagination: true,
        };

        test("should return page config pagination options", () => {
          const { next, prev } = usePagination({ siteConfig, pageConfig });

          expect(next).toBe(true);
          expect(prev).toBe(false);
        });
      });

      describe("With site config pagination as object", () => {
        /**
         * @type {Pick<import("../../../config").PulsarDocsConfig, "pagination">}
         */
        const siteConfig = {
          pagination: {
            next: true,
            prev: false,
          },
        };

        test("should return page config pagination options", () => {
          const { next, prev } = usePagination({ siteConfig, pageConfig });

          expect(next).toBe(true);
          expect(prev).toBe(false);
        });
      });
    });
  });
});
