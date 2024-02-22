import type { Defaults, CustomHeaders } from "@oazapfts/runtime";
import { updateConfig } from "./configStore";

export type BaserowConfig = Partial<Defaults<CustomHeaders>>;

export function configure(options: BaserowConfig): void {
  updateConfig(options);
}
