import { describe, it, expect } from "vitest";
import { makeFieldType } from "./makeFieldType";
import f from "../test/fixtures/fieldDefinition";

describe("makeFieldType", () => {
  it("should return a string", () => {
    expect(
      makeFieldType(
        f({
          id: 4780,
          table_id: 65,
          name: "Status",
          order: 7,
          type: "single_select",
          primary: false,
          read_only: false,
          select_options: [
            { id: 2510, value: "Proposal", color: "gray" },
            { id: 2512, value: "Execution", color: "dark-red" },
            { id: 2513, value: "Complete", color: "darker-blue" },
          ],
        }),
      ),
    ).toBe(`"Proposal" | "Execution" | "Complete"`);
  });
});
