import { BaserowSdk } from "./index.js";

export abstract class Factory {
  protected sdk: BaserowSdk;
  constructor({ sdk }: { sdk: BaserowSdk }) {
    this.sdk = sdk;
  }
}
