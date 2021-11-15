import { Component } from "../../../renderer/renderer";
import s from "./Input.module.scss";
import { getId } from "utils/id";
import { classNames as cn, domEvent } from "../../../renderer/utils";

export const Input: Component<{
  value: string | number;
  onChange: (newValue: string) => unknown;
  hasError?: boolean;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  type?: "checkbox" | "range" | "text" | "number";
}> = (
  { value, hasError, onChange, placeholder, min, max, step, type },
  { ref, effect }
) => {
  const id = ref("js-input-" + getId());
  domEvent(
    effect,
    "change",
    "." + id.current,
    (event) => {
      if (typeof onChange === "function") {
        let value = (event.target as HTMLInputElement).value;
        if (type === "number") {
          let numValue = Number(value.replace(/e/gim, ""));
          if (typeof max === "number" && numValue > max) {
            numValue = max;
          }
          if (typeof min === "number" && numValue < min) {
            numValue = min;
          }
          value = String(numValue);
        }
        onChange(value);
      }
    },
    [onChange]
  );
  return `<input class="${cn(
    s.input,
    hasError && s.hasError,
    id.current
  )}" value="${value}" placeholder="${placeholder}" min="${min}" max="${max}" step="${step}" type="${type}"/>`;
};
