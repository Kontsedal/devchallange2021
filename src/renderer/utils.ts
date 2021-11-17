import { ComponentUtils } from "./renderer";

export const classNames = (...classes: Array<string | boolean | undefined>) =>
  classes.filter(Boolean).join(" ");

/**
 * Adds delegated DOM event listener to the provided selector
 */
export const domEvent = (
  effect: ComponentUtils["effect"],
  eventName: string,
  selector: string,
  handler: (event: Event) => unknown,
  dependencies: any[] = []
) => {
  effect(() => {
    const delegatedHandler = (event: Event) => {
      if (!event) {
        return;
      }
      let expectedTarget = (event?.target as HTMLDivElement)?.closest(selector);
      if (expectedTarget) {
        handler(event);
      }
    };
    document.body.addEventListener(eventName, delegatedHandler);
    return () => document.body.removeEventListener(eventName, delegatedHandler);
  }, [handler, ...dependencies]);
};

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
