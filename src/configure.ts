import { defaults } from "./__generated__/baserow";
import type { Defaults, CustomHeaders } from "@oazapfts/runtime";

export type BaserowConfig = Partial<Defaults<CustomHeaders>>;

export function configure(options: BaserowConfig) {
  Object.assign(defaults, options);
}
