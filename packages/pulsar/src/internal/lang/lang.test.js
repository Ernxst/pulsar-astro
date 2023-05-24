import { describe, expect, test } from "vitest";
import { Lang } from "./lang";

describe("Lang.isCode", () => {
  describe("With a valid language code", () => {
    test("should return true", () => {
      expect(Lang.isCode("en")).toBe(true);
    });
  });

  describe("With an invalid language code", () => {
    test("should return false", () => {
      expect(Lang.isCode("foo")).toBe(false);
    });
  });
});

describe("Lang.fromPathname", () => {
  describe("With a lang code as the first path segment", () => {
    test("returns the lang code", () => {
      expect(Lang.fromPathname("/en/")).toBe("en");
    });
  });

  describe("With a lang code as the second path segment", () => {
    test("returns the lang code", () => {
      expect(Lang.fromPathname("/docs/en/")).toBe("en");
    });
  });

  describe("With no lang-code in the pathname", () => {
    test("returns undefined", () => {
      expect(Lang.fromPathname("/")).toBe(undefined);
    });
  });
});
