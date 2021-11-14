import { render } from "./renderer/renderer";
import { App } from "./view/App";
import "./style.css";

render(App, {
  target: document.querySelector("#app") as HTMLElement,
  props: {},
  key: "app",
});
