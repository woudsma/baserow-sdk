import pLimit from "p-limit";

const limit = pLimit(1);

type Response =
  | { status: 200; data: unknown }
  | { status: number; data: { error?: string; detail?: string | object } };

type MakeActionOptions<P extends Array<unknown>> = {
  fn: (...rest: P) => Promise<Response>;
};

export function makeAction<P extends Array<unknown>>({
  fn,
}: MakeActionOptions<P>) {
  return async <T>(...rest: P): Promise<T> => {
    const { status, data } = await limit(() => fn(...rest));

    if (status !== 200) {
      console.dir(data, {
        depth: null,
      });
      throw new Error(`Failed to execute action: ${status}`);
    }

    return data as T;
  };
}