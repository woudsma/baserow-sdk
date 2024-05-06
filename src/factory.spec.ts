import { describe, it, expect, beforeEach, vi } from "vitest";
import { Factory } from "./factory.js";
import { Row } from "./row.js";
import client from "./client.js";

const factory = new Factory();

describe("Factory", () => {
  beforeEach(() => {
    vi.mocked(client.get)
      .mockResolvedValue({
        data: {
          results: [{}],
          next: null,
        },
      })
      .mockResolvedValueOnce({
        data: {
          results: [{}],
          next: "the_next_url",
        },
      });
  });

  it("gets all", async () => {
    await factory.getMany(1, Row);
    expect(client.get).toBeCalledTimes(2);
  });
});
