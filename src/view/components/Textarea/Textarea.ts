import { Component } from "../../../renderer/renderer";
import s from "./Textarea.module.scss";
import { getId } from "utils/id";
import {
  attributes,
  classNames as cn,
  domEvent,
} from "../../../renderer/utils";

export const Textarea: Component<{
  value: string | number;
  disabled: boolean;
  onChange: (newValue: string) => unknown;
  hasError?: boolean;
  placeholder?: string;
  className?: string;
}> = (
  { value, disabled, className, hasError, onChange, placeholder },
  { ref, effect }
) => {
  const id = ref("js-textarea-" + getId());
  domEvent(
    effect,
    "change",
    "." + id.current,
    (event) => {
      if (typeof onChange === "function") {
        onChange((event.target as HTMLTextAreaElement).value);
      }
    },
    [onChange]
  );
  return `<textarea ${attributes({
    disabled,
    class: cn(s.textarea, hasError && s.hasError, id.current, className),
    placeholder,
  })}>${value}</textarea>`;
};
