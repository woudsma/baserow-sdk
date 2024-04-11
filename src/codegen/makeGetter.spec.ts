import { describe, it, expect } from "vitest";
import f from "../test/fixtures/fieldDefinition";
import { makeGetter } from "./makeGetter";
import { FieldDefinition } from "..";

function run(field: Partial<FieldDefinition> = {}): string {
  return makeGetter(f(field), []);
}

describe("makeGetter", () => {
  it.each([
    [{ type: "text" }, "string"],
    [{ type: "number" }, "number"],
    [
      {
        type: "single_select",
        select_options: [
          {
            id: 1,
            value: "the_option_name",
            color: "red",
          },
        ],
      },
      "the_option_name",
    ],
    [{ type: "date" }, ": Date"],
    [
      {
        type: "single_select",
        select_options: [
          {
            id: 1,
            value: "the_option_name",
            color: "red",
          },
        ],
      },
      `: "the_option_name"`,
    ],
    [
      {
        type: "single_select",
        select_options: [
          {
            id: 1,
            value: "the_option_name",
            color: "red",
          },
        ],
      },
      `<({ id: 1, value: "the_option_name", color: "red" })>`,
    ],
    [
      {
        type: "single_select",
        select_options: [
          {
            id: 1,
            value: "the_option_name",
            color: "red",
          },
          {
            id: 2,
            value: "the_option_name_2",
            color: "blue",
          },
        ],
      },
      `<({ id: 1, value: "the_option_name", color: "red" } | { id: 2, value: "the_option_name_2", color: "blue" })>`,
    ],
  ])("%s => `%s`", (field, expected) => {
    expect(run(field)).toContain(expected);
  });
});
