import { Component } from "./renderer/renderer";

const Tester2: Component = ({ value }, { template }) => {
  return template`<div><input type="text" value="${value}"/></div>`;
};
const Tester: Component = ({ value }, { template, child }) => {
  return template`<div><input type="range" min="0" max="10" value="${value}"/>${child(
    Tester2,
    { props: { value: 333 }, key: "inputText", dependencies: [] }
  )}</div>`;
};

export const App: Component = (_, { template, child }) => {
  return template`<div>
    <h1>hi there</h1>
    ${child(Tester, { props: { value: 1 }, key: "input", dependencies: [] })}
  </div>`;
};
