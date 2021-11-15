import { Component } from "renderer/renderer";
import s from "./Select.module.scss";
import { getId } from "utils/id";
import { attributes as attr, classNames as cn, domEvent } from "renderer/utils";

export const Select: Component<{
  value: string | number;
  disabled: boolean;
  onChange: (newValue: string) => unknown;
  options: { value: string; title: string }[];
}> = ({ value, disabled, onChange, options }, { ref, effect }) => {
  const id = ref("js-select-" + getId());
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
  return `<select  ${attr({
    disabled,
    class: cn(s.select, id.current),
  })}>
      ${options
        .map(
          (option) =>
            `<option ${attr({
              value: option.value,
              selected: option.value === value,
            })}>${option.title}</option>`
        )
        .join("")}
  </select>`;
};
