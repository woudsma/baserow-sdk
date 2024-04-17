import { Factory } from ".";
import { Row, RowType } from "./row.js";
import { describe, it, expect, vi } from "vitest";

class MyRow extends Row {
  public async doSomething(): Promise<Row<RowType, Factory>[]> {
    return this.getLinkedRows(1, "the_field", MyRow);
  }
}

describe("Row", () => {
  it("should do something", async () => {
    const getMany = vi.fn();

    const row = new MyRow({
      tableId: 1,
      rowId: 2,
      row: { id: 2, order: "1" },
      sdk: {} as any,
      repository: {
        getMany,
      } as any,
    });

    await row.doSomething();

    expect(getMany).toBeCalledWith(
      expect.anything(),
      expect.anything(),
      expect.objectContaining({
        filters: expect.objectContaining({
          filters: expect.arrayContaining([
            expect.objectContaining({
              field: "the_field",
            }),
          ]),
        }),
      }),
    );
  });
});
