import { Component } from "../../../renderer/renderer";
import s from "./Button.module.scss";
import { getId } from "utils/id";
import { classNames as cn, domEvent } from "renderer/utils";

export const Button: Component<{ text: string; onClick: () => unknown }> = (
  { text, onClick },
  { ref, effect }
) => {
  const id = ref("js-button-" + getId());

  domEvent(effect, "click", "." + id.current, () => {
    if (typeof onClick === "function") {
      onClick();
    }
  });
  return `<button class="${cn(s.button, id.current)}">${text}</button>`;
};
