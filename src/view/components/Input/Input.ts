import { Component } from "../../../renderer/renderer";
import s from "./Input.module.scss";
import { getId } from "utils/id";
import { classNames as cn, domEvent } from "../../../renderer/utils";

export const Input: Component<{
  value: string;
  onChange: (newValue: string) => unknown;
  hasError?: boolean;
  placeholder?: string;
}> = ({ value, hasError, onChange, placeholder }, { ref, effect }) => {
  const id = ref("js-input-" + getId());
  domEvent(
    effect,
    "change",
    "." + id.current,
    (event) => {
      if (typeof onChange === "function") {
        onChange((event.target as HTMLInputElement).value);
      }
    },
    [onChange]
  );
  return `<input class="${cn(
    s.input,
    hasError && s.hasError,
    id.current
  )}" value="${value}" placeholder="${placeholder}"/>`;
};
