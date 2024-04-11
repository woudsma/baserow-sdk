import rc from "rc";
import z from "zod";

const schema = z
  .object({
    url: z.string(),
    tables: z.record(z.string(), z.number()),
    databaseToken: z.string(),
    outDir: z.string(),
    config: z.string(),
  })
  .partial();

export type BaserowConfig = z.infer<typeof schema>;

export function getConfig(): BaserowConfig {
  return schema.parse(rc("baserow"));
}
