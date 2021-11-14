import { Component } from "./renderer/renderer";

const Tester: Component = ({ value }, { template }) => {
  return template`<div><input type="range" min="0" max="10" value="${value}"/></div>`;
};

export const App: Component = (_, { template, child }) => {
  return template`<div>
    <h1>hi there</h1>
    ${child(Tester, { props: { value: 1 }, key: "input", dependencies: [] })}
  </div>`;
};
