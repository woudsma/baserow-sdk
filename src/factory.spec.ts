import { describe, it, expect, beforeEach, vi } from "vitest";
import { Factory } from "./factory";
import { Row } from "./row";
import client from "./client";

const factory = new Factory();

describe("Factory", () => {
  beforeEach(() => {
    vi.mocked(client.get)
      .mockResolvedValue({
        data: {
          results: [],
        },
      })
      .mockResolvedValueOnce({
        data: {
          results: [{}],
        },
      });
  });

  it("gets all", async () => {
    await factory.getMany(1, Row);
    expect(client.get).toBeCalledTimes(2);
  });
});
