import { render } from "./renderer/renderer";
import { App } from "./app";

render(App, {
  target: document.querySelector("#app") as HTMLElement,
  key: "app",
});
