import { BaserowSdk } from "./index.js";
import { describe, it, expect, beforeEach, vi } from "vitest";
import client from "./client.js";

describe("BaserowSdk", () => {
  let sdk: BaserowSdk;

  beforeEach(() => {
    sdk = new BaserowSdk("the_token");
    vi.mocked(client.post).mockResolvedValue({ data: { name: "test" } });
  });

  it("validates row ID is a valid number", async () => {
    await expect(sdk.getRow(1, NaN)).rejects.toThrow("Invalid row ID");
    await expect(sdk.getRow(1, Infinity)).rejects.toThrow("Invalid row ID");
  });

  it("returns the new row", async () => {
    const result = await sdk.addRow(1, { name: "test" });

    expect(result).toEqual({ name: "test" });
  });
});
