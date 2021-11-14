import { Component } from "./renderer/renderer";

const Tester2: Component = (_, { template, effect, state, event }) => {
  const [counter, setCounter] = state(0);
  effect(() => {
    let interval = setInterval(() => {
      setCounter((oldValue) => oldValue + 1);
    }, 500);
    return () => clearInterval(interval);
  }, []);
  event("click", ".js-test", () => {
    console.log("clicked");
  });
  return template`<h1 class="js-test">${counter}</h1>`;
};
const Tester: Component = ({ value }, { template, child, state, effect }) => {
  const [show, setShow] = state(true);
  effect(() => {
    setTimeout(() => {
      setShow(() => false);
    }, 5000);
  }, []);
  return template`<div><input type="range" min="0" max="10" value="${value}"/>${
    show
      ? child(Tester2, {
          props: { value: 333 },
          key: "inputText",
          dependencies: [],
        })
      : ""
  }</div>`;
};

export const App: Component = (_, { template, child }) => {
  return template`<div>
    <h1>hi there</h1>
    ${child(Tester, { props: { value: 1 }, key: "input", dependencies: [] })}
  </div>`;
};
