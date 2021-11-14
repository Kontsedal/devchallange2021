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
