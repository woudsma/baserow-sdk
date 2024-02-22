import { defaults } from "./__generated__/baserow";
import type { Defaults, CustomHeaders } from "@oazapfts/runtime";

const config = defaults;

export function getConfig(): Defaults<CustomHeaders> {
  return config;
}

export function updateConfig(
  newConfig: Partial<Defaults<CustomHeaders>>,
): void {
  Object.assign(config, newConfig);
}
