const CACHE_KEYS = {
  CHILDREN: "children",
  DEPENDENCIES: "deps",
  HTML: "html",
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
  cache = new Map<string, any>()
) => {
  if (!cache.has(parentKey)) {
    cache.set(parentKey, new Map());
  }
  const componentCache = cache.get(parentKey);
  let child =
    (
      childComponent: Component,
      {
        props,
        dependencies,
        key,
      }: { props: any; dependencies: any[]; key: string }
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
  let template = (
    input: TemplateStringsArray,
    ...params: ReadonlyArray<any>
  ) => {
    return input.reduce((res, item, index) => {
      let entry = params[index];
      let param =
        typeof entry === "function" ? entry(props, { template, child }) : entry;
      return res + item + (param || "");
    }, "");
  };

  const result = component(props, { template, child }).replace(
    /^(<\w+)/,
    `$1 data-key="${parentKey}"`
  );
  if (target) {
    target.outerHTML = result;
  }
  return result;
};

function dependenciesAreEqual(prev: any[], current: any[]) {
  return (
    prev.length === current.length &&
    prev.every((_, index) => prev[index] === current[index])
  );
}

function getChildCache(cache: Map<string, any>, childKey: string) {
  if (!cache.has(CACHE_KEYS.CHILDREN)) {
    cache.set(CACHE_KEYS.CHILDREN, new Map());
  }
  const childrenCache = cache.get(CACHE_KEYS.CHILDREN);
  if (!childrenCache.has(childKey)) {
    childrenCache.set(childKey, new Map());
  }
  return childrenCache.get(childKey);
}
