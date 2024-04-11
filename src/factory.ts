import { getConfig } from "./getConfig.js";
import { BaserowSdk } from "./index.js";

export abstract class Factory {
  protected sdk: BaserowSdk;
  constructor() {
    const config = getConfig();
    this.sdk = new BaserowSdk(config.databaseToken);
  }
}
