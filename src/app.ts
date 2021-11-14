import { Component } from "./renderer/renderer";

const Tester2: Component = (_, { template, effect, state }) => {
  const [counter, setCounter] = state(0);
  effect(() => {
    let interval = setInterval(() => {
      setCounter((oldValue) => oldValue + 1);
      console.log("tick");
    }, 500);
    return () => clearInterval(interval);
  }, []);
  return template`<h1>${counter}</h1>`;
};
const Tester: Component = ({ value }, { template, child, state, effect }) => {
  const [show, setShow] = state(true);
  effect(() => {
    setTimeout(() => {
      setShow(() => false);
    }, 2000);
  }, []);
  console.log({ show });
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
