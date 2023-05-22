import { describe, expect, test } from "vitest";
import { getLangFromPathname } from "./util";

describe("getLangFromPathname", () => {
  describe("With a lang code as the first path segment", () => {
    test("returns the lang code", () => {
      expect(getLangFromPathname("/en/")).toBe("en");
    });
  });

  describe("With a lang code as the second path segment", () => {
    test("returns the lang code", () => {
      expect(getLangFromPathname("/docs/en/")).toBe("en");
    });
  });

  describe("With no lang-code in the pathname", () => {
    test("returns undefined", () => {
      expect(getLangFromPathname("/")).toBe(undefined);
    });
  });
});
