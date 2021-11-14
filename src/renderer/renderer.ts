const CACHE_KEYS = {
  CHILDREN: "children",
  DEPENDENCIES: "deps",
  HTML: "html",
  REFS: "refs",
  STATES: "states",
  EFFECTS: "effects",
  PREV_DEPENDENCIES: "prevDependencies",
  CLEANUP_FUNCTION: "cleanup_function",
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
  state: <T>(
    value: T
  ) => [state: T, setState: (newValue: (oldValue: T) => T) => void];
  effect: (fn: () => (() => void) | void, dependencies: any[]) => void;
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
  let renderedChildrenKeys: string[] = [];
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
      let childrenCache = getSubCache(componentCache, CACHE_KEYS.CHILDREN);
      let childCache = getSubCache(childrenCache, childKey);
      let prevDependencies = childCache.get(CACHE_KEYS.DEPENDENCIES);
      if (
        prevDependencies &&
        !dependenciesAreEqual(prevDependencies, dependencies)
      ) {
        return childCache.get(CACHE_KEYS.HTML);
      }
      let html = render(childComponent, { props, key: childKey }, childCache);
      childCache.set(CACHE_KEYS.HTML, html);
      childCache.set(CACHE_KEYS.DEPENDENCIES, dependencies);
      renderedChildrenKeys.push(childKey);
      return html;
    };
  let callCount = 0;
  let ref = <T>(value: T): { current: T } => {
    callCount++;
    const id = callCount;
    const refCache = getSubCache(cache, CACHE_KEYS.REFS);
    if (refCache.has(id)) {
      return refCache.get(id);
    }
    let result = { current: value };
    refCache.set(id, result);
    return result;
  };
  let state = <T>(
    value: T
  ): [state: T, setState: (newValue: (oldValue: T) => T) => void] => {
    callCount++;
    const id = callCount;
    const statesCache = getSubCache(cache, CACHE_KEYS.REFS);
    if (statesCache.has(id)) {
      return statesCache.get(id);
    }
    const setState = (valueGetter: (oldValue: T) => T) => {
      let oldValue = statesCache.get(id);
      statesCache.set(id, [valueGetter(oldValue[0]), oldValue[1]]);
      performRender(true);
    };
    statesCache.set(id, [value, setState]);
    return [value, setState];
  };
  let effect = (fn: () => (() => void) | void, dependencies: any[]) => {
    callCount++;
    const id = callCount;
    const effectsCache = getSubCache(cache, CACHE_KEYS.EFFECTS);
    const effectCache = getSubCache(effectsCache, id);
    let prevDependencies = effectCache.get(CACHE_KEYS.PREV_DEPENDENCIES);
    if (
      prevDependencies &&
      dependenciesAreEqual(prevDependencies, dependencies)
    ) {
      return;
    }
    if (
      prevDependencies &&
      !dependenciesAreEqual(prevDependencies, dependencies)
    ) {
      let cleanup = effectCache.get(CACHE_KEYS.CLEANUP_FUNCTION);
      if (typeof cleanup === "function") {
        cleanup();
      }
    }
    let cleanup = fn();
    effectCache.set(CACHE_KEYS.CLEANUP_FUNCTION, cleanup);
    effectCache.set(CACHE_KEYS.PREV_DEPENDENCIES, dependencies);
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
    return { template, child, ref, state, effect };
  }

  function performRender(isRerender: boolean) {
    let componentRef = document.querySelector(`[data-key="${parentKey}"]`);
    const result = component(props, getUtils()).replace(
      /^(<\w+)/,
      `$1 data-key="${parentKey}"`
    );
    callCount = 0;
    if (target && !isRerender) {
      target.outerHTML = result;
    }
    if (componentRef && isRerender) {
      componentRef.outerHTML = result;
    }
    const childrenCache = getSubCache(componentCache, CACHE_KEYS.CHILDREN);
    childrenCache.forEach((childCache: Map<any, any>, key) => {
      if (!renderedChildrenKeys.includes(key as string)) {
        childCache
          .get(CACHE_KEYS.EFFECTS)
          ?.forEach((effectCache: Map<any, any>) => {
            let cleanupFn = effectCache.get(CACHE_KEYS.CLEANUP_FUNCTION);
            if (typeof cleanupFn === "function") {
              cleanupFn();
            }
          });
        childrenCache.delete(key);
      }
    });
    renderedChildrenKeys = [];
    return result;
  }

  return performRender(false);
};

function dependenciesAreEqual(prev: any[], current: any[]) {
  return (
    prev.length === current.length &&
    prev.every((_, index) => prev[index] === current[index])
  );
}

function getSubCache(
  cache: Map<string | number, any>,
  key: string | number
): Map<string | number, any> {
  if (!cache.has(key)) {
    cache.set(key, new Map());
  }
  return cache.get(key);
}
