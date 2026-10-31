import { describe, expect, it } from "vitest";
import { formatCompactNumber } from "./format-compact-number";


describe("formatCompactNumber", () => {
  it.each([
    [0, "0"],
    [999, "999"],
    [1200, "1.2K"],
    [12400, "12.4K"],
    [1500000, "1.5M"]
  ])("formats %d as %s", (value, expected) => {
    expect(formatCompactNumber(value)).toBe(expected);
  });
});