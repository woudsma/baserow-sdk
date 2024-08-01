import rc from "rc";
import z from "zod";

const schema = z.object({
  url: z.string(),
  tables: z.record(
    z.string(),
    z.preprocess((val) => parseFloat(val as string), z.number()),
  ),
  databaseToken: z.string(),
  outDir: z.string(),
  config: z.optional(z.string()),
});

export type BaserowConfig = z.infer<typeof schema>;

export function getConfig(): BaserowConfig {
  return schema.parse(rc("baserow", { tables: {} }));
}
