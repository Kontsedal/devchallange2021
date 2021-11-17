export const classNames = (...classes: Array<string | boolean | undefined>) =>
  classes.filter(Boolean).join(" ");


/**
 * Converts attributes object to a valid attributes string
 * @example attributes({disabled: true, value: 1}) ==> "disabled value='1'"
 */
export const attributes = (
  attributes: Record<string, string | number | boolean | undefined>
) =>
  Object.entries(attributes).reduce((result, [key, value]) => {
    if (typeof value === "boolean") {
      if (value) {
        return result + ` ${key}`;
      }
      return result;
    } else {
      if (typeof value !== "undefined") {
        return result + ` ${key}="${value}"`;
      }
      return result;
    }
  }, "");
