import { Component } from "../../../renderer/renderer";
import s from "./Button.module.scss";
import { getId } from "utils/id";
import { classNames as cn, domEvent } from "renderer/utils";

export const Button: Component<{
  text: string;
  onClick: () => unknown;
  className?: string;
}> = ({ text, onClick, className }, { ref, effect, template }) => {
  const id = ref("js-button-" + getId());

  domEvent(effect, "click", "." + id.current, () => {
    if (typeof onClick === "function") {
      onClick();
    }
  });
  return template`<button class="${cn(
    s.button,
    id.current,
    className
  )}">${text}</button>`;
};
