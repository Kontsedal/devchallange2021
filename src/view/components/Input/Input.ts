import { Component } from "../../../renderer/renderer";
import s from "./Input.module.scss";
import { getId } from "utils/id";
import { classNames as cn } from "../../../renderer/utils";

export const Input: Component<{
  value: string;
  onChange: (newValue: string) => unknown;
}> = ({ value, onChange }, { ref, event }) => {
  const id = ref("js-input-" + getId());
  console.log({ value });
  event("change", "." + id.current, (event) => {
    if (typeof onChange === "function") {
      onChange((event.target as HTMLInputElement).value);
    }
  });
  return `<input class="${cn(s.button, id.current)}" value="${value}"/>`;
};
