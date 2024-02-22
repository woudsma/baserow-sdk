import { describe, it, expect, vi, beforeEach } from "vitest";
import { listRows } from "./listRows";
import { listDatabaseTableRows } from "../__generated__/baserow";
import { configure } from "../configure";

vi.mock("./__generated__/baserow");

describe("listRows", () => {
  beforeEach(() => {
    vi.mocked(listDatabaseTableRows).mockResolvedValue({
      status: 200,
      data: {},
    } as any);
  });

  it("runs", async () => {
    await listRows(1);
  });

  it("passes config explicitly", async () => {
    configure({
      baseUrl: "https://example.com",
    });

    await listRows(1);

    expect(listDatabaseTableRows).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      expect.objectContaining({
        baseUrl: "https://example.com",
      }),
    );
  });
});
