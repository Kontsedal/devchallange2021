const CACHE_KEYS = {
  CHILDREN: "children",
  DEPENDENCIES: "deps",
  HTML: "html",
  REFS: "refs",
  STATES: "states",
  EFFECTS: "effects",
  EVENTS: "events",
  MEMO: "memo",
  VALUE: "value",
  PREV_DEPENDENCIES: "prevDependencies",
  CLEANUP_FUNCTION: "cleanup_function",
};
export type ComponentUtils = {
  template: (
    input: TemplateStringsArray,
    ...params: ReadonlyArray<any>
  ) => string;
  child: <T extends object>(
    childComponent: Component<T>,
    { props, dependencies, key }: { props: T; dependencies: any[]; key: string }
  ) => () => string;
  ref: <T>(value: T) => { current: T };
  state: <T>(
    value: T
  ) => [state: T, setState: (newValue: (oldValue: T) => T) => void];
  effect: (fn: () => (() => void) | void, dependencies: any[]) => void;
  memo: <T extends () => any>(fn: T, dependencies: any[]) => ReturnType<T>;
};
const KEY_DELIMITER = "->";
export type Component<T extends object> = (
  props: T,
  utils: ComponentUtils,
  key: string
) => string;
const rootMap = new Map<string | number, any>();

export const render = <T extends object>(
  component: Component<T>,
  {
    props,
    target,
    key: parentKey,
  }: {
    key: string;
    props: T;
    target?: HTMLElement;
  },
  cache = rootMap
) => {
  const componentCache = getSubCache(cache, parentKey);
  let renderedChildrenKeys: string[] = [];
  let child =
    <T extends object>(
      childComponent: Component<T>,
      {
        props,
        dependencies,
        key,
      }: { props: T; dependencies: any[]; key: string }
    ) =>
    (): string => {
      let childKey = parentKey + KEY_DELIMITER + key;
      let childrenCache = getSubCache(componentCache, CACHE_KEYS.CHILDREN);
      let childCache = getSubCache(childrenCache, childKey);
      let prevDependencies = childCache.get(CACHE_KEYS.DEPENDENCIES);
      if (
        prevDependencies &&
        dependenciesAreEqual(prevDependencies, dependencies)
      ) {
        renderedChildrenKeys.push(childKey);
        return childCache.get(CACHE_KEYS.HTML);
      }
      let html = render(childComponent, { props, key: childKey }, childCache);
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
  let memo = <T extends () => any>(
    fn: T,
    dependencies: any[]
  ): ReturnType<T> => {
    callCount++;
    const id = callCount;
    const memosCache = getSubCache(cache, CACHE_KEYS.MEMO);
    const memoCache = getSubCache(memosCache, id);
    const prevDependencies = memoCache.get(CACHE_KEYS.PREV_DEPENDENCIES);
    if (
      memoCache.has(id) &&
      dependenciesAreEqual(prevDependencies, dependencies)
    ) {
      return memoCache.get(CACHE_KEYS.VALUE);
    }
    let result = fn();
    memoCache.set(CACHE_KEYS.VALUE, result);
    memoCache.set(CACHE_KEYS.PREV_DEPENDENCIES, dependencies);
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
    setTimeout(() => {
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
    }, 0);
  };
  let template = (
    input: TemplateStringsArray,
    ...params: ReadonlyArray<any>
  ) => {
    return input.reduce((res, item, index) => {
      let entry = params[index];
      let param;
      if (Array.isArray(entry)) {
        param = entry.reduce((result, item) => {
          return (
            result +
            (typeof item === "function" ? item(props, getUtils()) : item)
          );
        }, "");
      } else {
        param = typeof entry === "function" ? entry(props, getUtils()) : entry;
      }
      return res + item + (param || "");
    }, "");
  };

  function getUtils(): ComponentUtils {
    return { template, child, ref, state, effect, memo };
  }

  function getRootElement() {
    return document.querySelector(`[data-key="${parentKey}"]`) as HTMLElement;
  }

  function performRender(isRerender: boolean) {
    let componentRef = getRootElement();

    const result = component(props, getUtils(), parentKey).replace(
      /^(<\w+)/,
      `$1 data-key="${parentKey}"`
    );
    cache.set(CACHE_KEYS.HTML, result);
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
        childCache.get(CACHE_KEYS.EVENTS)?.forEach((cleanup: () => unknown) => {
          if (typeof cleanup === "function") {
            cleanup();
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
