import { describe, expect, it } from "vitest";
import { parseCategoryParam } from "./search-params";

describe("parseCategoryParam", () => {
  it.each([
    ["music", "music"],
    ["just-chatting", "just-chatting"],
  ])("accepts a valid category %s", (input, expected) => {
    expect(parseCategoryParam(input)).toBe(expected);
  });

  it.each([
    ["missing", undefined],
    ["empty", ""],
    ["unknown", "cooking"],
    ["wrong case", "MUSIC"],
    ["repeated param", ["music", "gaming"]],
  ])("ignores %s", (_label, input) => {
    expect(parseCategoryParam(input)).toBeUndefined();
  });
});