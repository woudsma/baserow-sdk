import { describe, it, expect } from "vitest";
import makeClassMethods from "./makeClassMethods";
import f from "../test/fixtures/fieldDefinition";

describe("makeClassMethods", () => {
  it("returns empty string for empty fields", () => {
    expect(makeClassMethods([])).toBe("");
  });

  it("returns string for single field", () => {
    expect(
      makeClassMethods([
        f({
          name: "the_field_name",
        }),
      ]),
    ).toContain("the_field_name");
  });

  it("returns string for multiple fields", () => {
    expect(
      makeClassMethods([
        f({
          name: "the_field_name",
        }),
        f({
          name: "the_field_name2",
        }),
      ]),
    ).toContain("the_field_name2");
  });

  it("handles field names with spaces", () => {
    expect(
      makeClassMethods([
        f({
          name: "the field name",
        }),
      ]),
    ).toContain("getTheFieldName");
  });

  it("handles field names with spaces in setter", () => {
    expect(
      makeClassMethods([
        f({
          name: "the field name",
        }),
      ]),
    ).toContain("setTheFieldName");
  });

  it("sets return type", () => {
    expect(
      makeClassMethods([
        f({
          name: "the_field_name",
          type: "text",
        }),
      ]),
    ).toContain("(): string");
  });

  it("uses mapped type for value arg", () => {
    expect(
      makeClassMethods([
        f({
          name: "the_field_name",
          type: "text",
        }),
      ]),
    ).toContain("value: string");
  });

  it("uses mapped type for getField generic", () => {
    expect(
      makeClassMethods([
        f({
          name: "the_field_name",
          type: "text",
        }),
      ]),
    ).toContain("<string>");
  });

  it("handles emoji field name", () => {
    expect(
      makeClassMethods([
        f({
          name: "🔥",
        }),
      ]),
    ).toContain("getFire()");
  });

  it("handles lookup types", () => {
    expect(
      makeClassMethods([
        f({
          name: "the_field_name",
          type: "lookup",
          formula_type: "number",
        }),
      ]),
    ).toContain("number");
  });

  it("parses numbers", () => {
    expect(
      makeClassMethods([
        f({
          name: "the_field_name",
          type: "number",
        }),
      ]),
    ).toContain("parseFloat");
  });

  it("does not create setter for read-only field", () => {
    expect(
      makeClassMethods([
        f({
          name: "the_field_name",
          read_only: true,
        }),
      ]),
    ).not.toContain("setTheFieldName");
  });
});
