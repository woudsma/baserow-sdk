import { describe, it, expect, beforeEach, vi } from "vitest";
import { Factory } from "./factory.js";
import { Row } from "./row.js";
import client from "./client.js";

const factory = new Factory();

describe("Factory", () => {
  beforeEach(() => {
    vi.mocked(client.get).mockResolvedValue({
      data: {
        results: [{}],
        next: null,
      },
    });
  });

  it("gets all", async () => {
    vi.mocked(client.get).mockResolvedValueOnce({
      data: {
        results: [{}],
        next: "the_next_url",
      },
    });
    await factory.getMany(1, Row);
    expect(client.get).toBeCalledTimes(2);
  });

  it("treats page as one indexed", async () => {
    await factory.getMany(1, Row);
    expect(client.get).not.toBeCalledWith(
      expect.anything(),
      expect.objectContaining({ params: expect.objectContaining({ page: 0 }) }),
    );
  });

  it("includes page with all requests", async () => {
    await factory.getMany(1, Row);
    expect(client.get).toBeCalledWith(
      expect.anything(),
      expect.objectContaining({ params: expect.objectContaining({ page: 1 }) }),
    );
  });

  it("returns results", async () => {
    const results = await factory.getMany(1, Row);
    expect(results).toHaveLength(1);
  });
});
