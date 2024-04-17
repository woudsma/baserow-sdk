import { describe, it, expect } from "vitest";
import { getRawType } from "./getRawType";
import f from "../test/fixtures/fieldDefinition";

describe("getRawType", () => {
  it("runs", () => {
    expect(getRawType(f({ type: "text" }))).toBe("string");
  });
});
