import { model, observe } from "@formily/reactive";
import { createContext, useContext, useEffect, useMemo } from "react";
import { useLocalStorageState } from "ahooks";

const getScopeModel = (vars?: Record<string, any>) =>
  model({
    active: "",
    vars: vars ?? {},
    get options() {
      return Object.keys(this.vars).map((name) => {
        return { label: name, value: name, key: name };
      });
    },
    get current() {
      return this.vars[this.active];
    },
    setCurrent(neo: string) {
      this.vars[this.active] = neo;
    },
  });

const getApiModel = (store?: Record<string, any>) =>
  model({
    store: store ?? ({} as Record<string, Record<string, any>>),
    active: "",
    get groups() {
      return Object.keys(this.store);
    },
    addGroup(neo: string) {
      if (this.store[neo]) return;
      this.store[neo] = {};
    },
    get current() {
      const [group, key] = this.active.split(".");
      if (!group || !key) return null;
      return this.store[group][key];
    },
  });

export const FeatureContext = createContext({
  scope: getScopeModel(),
  api: getApiModel(),
});

export const FeatureProvider: React.FC<
  React.PropsWithChildren<{
    getInit: () => {
      vars: Record<string, any>;
      apis: Record<string, any>;
    };
    onChange: (neo: {
      vars: Record<string, any>;
      apis: Record<string, any>;
    }) => void;
  }>
> = (props) => {
  const ctx = useMemo(() => {
    const init = props.getInit();
    const scope = getScopeModel(init?.vars);
    const api = getApiModel(init?.apis);
    return { scope, api };
  }, []);
  useEffect(() => {
    const d1 = observe(ctx.scope, () => {
      props?.onChange?.({ vars: ctx.scope.vars, apis: ctx.api.store });
    });

    const d2 = observe(ctx.api, () => {
      props?.onChange?.({ vars: ctx.scope.vars, apis: ctx.api.store });
    });
    return () => {
      d1();
      d2();
    };
  }, [ctx]);
  return (
    <FeatureContext.Provider value={ctx}>
      {props.children}
    </FeatureContext.Provider>
  );
};

export const useFeatureApi = () => {
  const { api } = useContext(FeatureContext);
  return api;
};

export const useFeatureScope = () => {
  const { scope } = useContext(FeatureContext);
  return scope;
};
