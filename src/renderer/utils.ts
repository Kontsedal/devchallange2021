import { ComponentUtils } from "./renderer";

export const classNames = (...classes: Array<string | boolean | undefined>) =>
  classes.filter(Boolean).join(" ");

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
