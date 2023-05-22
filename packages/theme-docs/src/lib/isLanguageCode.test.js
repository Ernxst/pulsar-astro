import { describe, expect, test } from "vitest";
import { isLanguageCode } from "./util";

describe("isLanguageCode", () => {
  describe("With a valid language code", () => {
    test("should return true", () => {
      expect(isLanguageCode("en")).toBe(true);
    });
  });

  describe("With an invalid language code", () => {
    test("should return false", () => {
      expect(isLanguageCode("foo")).toBe(false);
    });
  });
});
