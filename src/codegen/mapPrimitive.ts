const DEFAULT_TYPE = "unknown";

export function mapPrimitive(baserowPrimitive: string | undefined): string {
  switch (baserowPrimitive) {
    case "text":
      return "string";
    case "number":
      return "number | string";
    case "long_text":
      return "string";
    case "boolean":
      return "boolean";
    case "button":
      return "string";
    case "date":
      return "string";
    default:
      return DEFAULT_TYPE;
  }
}
