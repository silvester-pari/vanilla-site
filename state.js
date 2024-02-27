export const createState = (initState) => {
  const handler = {
    set(target, property, value) {
      if (target[property] === value) {
        return true;
      }
      globalThis.postMessage({
        type: "refresh",
        property,
        value,
      });
      return Reflect.set(...arguments);
    },
  };

  globalThis.state = new Proxy(initState, handler);
};
