import { Component } from "../../../renderer/renderer";
import s from "./Button.module.scss";
import { getId } from "utils/id";
import { attributes, classNames as cn } from "renderer/utils";

export const Button: Component<{
  text: string;
  onClick: () => unknown;
  disabled?: boolean;
  className?: string;
}> = ({ text, onClick, disabled, className }, { ref, template, event }) => {
  const id = ref("js-button-" + getId());

  event(
    "click",
    "." + id.current,
    () => {
      if (typeof onClick === "function" && !disabled) {
        onClick();
      }
    },
    [disabled, onClick]
  );
  return template`<button ${attributes({
    disabled,
    class: cn(s.button, id.current, className),
  })}>${text}</button>`;
};
