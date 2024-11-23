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
  console.log(process.env.BASEROW_CONFIG);
  console.log(JSON.parse(process.env.BASEROW_CONFIG || "{}"));
  if (process.env.BASEROW_CONFIG) {
    console.log(JSON.parse(process.env.BASEROW_CONFIG || "{}"));
    return schema.parse(JSON.parse(process.env.BASEROW_CONFIG || "{}"));
  }
  return schema.parse(rc("baserow", { tables: {} }));
}
