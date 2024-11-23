import * as emoji from "node-emoji";

export function toCamelCase(str: string, upper: boolean = false): string {
  const _str = emoji
    .unemojify(str)
    .replaceAll(":", "")
    .replace(/([-_\s:][a-z])/gi, ($1) => {
      return $1
        .toUpperCase()
        .replace("-", "")
        .replace("_", "")
        .replace(" ", "");
    });

  if (upper) {
    return _str.charAt(0).toUpperCase() + _str.slice(1);
  }

  return _str;
}

export function capitalizeFirstLetter(val: string) {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}
