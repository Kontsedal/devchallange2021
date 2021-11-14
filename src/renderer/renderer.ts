const CACHE_KEYS = {
  CHILDREN: "children",
  DEPENDENCIES: "deps",
  HTML: "html",
  REFS: "refs",
  STATES: "states",
};
type Utils = {
  template: (
    input: TemplateStringsArray,
    ...params: ReadonlyArray<any>
  ) => string;
  child: (
    childComponent: Component,
    {
      props,
      dependencies,
      key,
    }: { props: any; dependencies: any[]; key: string }
  ) => () => string;
  ref: <T>(value: T) => { current: T };
  state: <T>(value: T) => [state: T, setState: (newValue: T) => void];
};

export type Component = (props: any, utils: Utils) => string;
export const render = (
  component: Component,
  {
    props,
    target,
    key: parentKey,
  }: {
    key: string;
    props?: any;
    target?: HTMLElement;
  },
  cache = new Map<string | number, any>()
) => {
  const componentCache = getSubCache(cache, parentKey);
  let child =
    (
      childComponent: Component,
      {
        props,
        dependencies,
        key,
      }: { props?: any; dependencies: any[]; key: string }
    ) =>
    (): string => {
      let childKey = parentKey + "->" + key;
      let childCache = getChildCache(componentCache, childKey);
      let prevDependencies = childCache.get(CACHE_KEYS.DEPENDENCIES);
      if (
        prevDependencies &&
        !dependenciesAreEqual(prevDependencies, dependencies)
      ) {
        return childCache.get(CACHE_KEYS.HTML);
      }
      let html = render(childComponent, { props, key: childKey });
      childCache.set(CACHE_KEYS.HTML, html);
      childCache.set(CACHE_KEYS.DEPENDENCIES, dependencies);
      return html;
    };
  let callCount = 0;
  let ref = <T>(value: T): { current: T } => {
    callCount++;
    const refCache = getSubCache(cache, CACHE_KEYS.REFS);
    if (refCache.has(callCount)) {
      return refCache.get(callCount);
    }
    let result = { current: value };
    refCache.set(callCount, result);
    return result;
  };
  let state = <T>(value: T): [state: T, setState: (newValue: T) => void] => {
    callCount++;
    const statesCache = getSubCache(cache, CACHE_KEYS.REFS);
    if (statesCache.has(callCount)) {
      return statesCache.get(callCount);
    }
    const setState = (newValue: T) => {
      let oldValue = statesCache.get(callCount);
      statesCache.set(callCount, [newValue, oldValue[1]]);
      performRender(true);
    };
    statesCache.set(callCount, [value, setState]);
    return [value, setState];
  };
  let template = (
    input: TemplateStringsArray,
    ...params: ReadonlyArray<any>
  ) => {
    return input.reduce((res, item, index) => {
      let entry = params[index];
      let param =
        typeof entry === "function" ? entry(props, getUtils()) : entry;
      return res + item + (param || "");
    }, "");
  };

  function getUtils(): Utils {
    return { template, child, ref, state };
  }
  let componentRef: HTMLElement | null;
  function performRender(isRerender: boolean) {
    const result = component(props, getUtils()).replace(
      /^(<\w+)/,
      `$1 data-key="${parentKey}"`
    );
    if (target && !isRerender) {
      target.outerHTML = result;
    }
    if (componentRef && isRerender) {
      componentRef.outerHTML = result;
      return result;
    }
    componentRef = document.querySelector(`[data-key="${parentKey}"]`);
    return result;
  }

  let result = performRender(false);
  callCount = 0;
  return result;
};

function dependenciesAreEqual(prev: any[], current: any[]) {
  return (
    prev.length === current.length &&
    prev.every((_, index) => prev[index] === current[index])
  );
}

function getChildCache(cache: Map<string | number, any>, childKey: string) {
  const childrenCache = getSubCache(cache, CACHE_KEYS.CHILDREN);
  return getSubCache(childrenCache, childKey);
}

function getSubCache(cache: Map<string | number, any>, key: string) {
  if (!cache.has(key)) {
    cache.set(key, new Map());
  }
  return cache.get(key);
}
