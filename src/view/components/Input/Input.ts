import { Component } from "../../../renderer/renderer";
import s from "./Input.module.scss";
import { getId } from "utils/id";
import {
  attributes,
  classNames as cn,
} from "../../../renderer/utils";

export const Input: Component<{
  value: string | number;
  onChange: (newValue: string) => unknown;
  hasError?: boolean;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  min?: number;
  max?: number;
  step?: number;
  type?: "checkbox" | "range" | "text" | "number";
}> = (
  {
    value,
    disabled,
    className,
    hasError,
    onChange,
    placeholder,
    min,
    max,
    step,
    type,
  },
  { ref, event }
) => {
  const id = ref("js-input-" + getId());
  event(
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
  return `<input ${attributes({
    class: cn(s.input, hasError && s.hasError, id.current, className),
    value,
    placeholder,
    disabled,
    min,
    max,
    step,
    type,
  })}/>`;
};
