import { config } from "./configStore";
import type { Defaults, CustomHeaders } from "@oazapfts/runtime";

export type BaserowConfig = Partial<Defaults<CustomHeaders>>;

export function configure(options: BaserowConfig): void {
  Object.assign(config, options);
}
