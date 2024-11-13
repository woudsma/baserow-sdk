import { describe, it, expect } from "vitest";
import main from "./codegen.js";
import { getConfig } from "./getConfig.js";
import { vi } from "vitest";
import { BaserowSdk } from "./index.js";
import fs from "fs";

vi.mock("./getConfig.js");
vi.mock("./index.js");
vi.mock("fs");

describe("codegen", () => {
  it("does not generate self-referential imports", async () => {
    vi.mocked(getConfig).mockReturnValue({
      url: "url",
      databaseToken: "token",
      outDir: "out",
      tables: { Tasks: 1 },
    });

    vi.mocked(BaserowSdk.prototype.listFields).mockResolvedValue([
      {
        id: 1,
        table_id: 1,
        name: "parent",
        order: 1,
        type: "link_row",
        primary: false,
        read_only: false,
        link_row_table_id: 1,
      },
    ]);

    await main({ isDev: true });

    expect(fs.writeFileSync).not.toBeCalledWith(
      expect.stringContaining("Tasks"),
      expect.stringMatching(/import.*TasksRow.*from/),
    );
  });
});
