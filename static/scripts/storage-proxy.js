function StorageProxy(itemKey) {
  try {
    this.model = JSON.parse(localStorage.getItem(itemKey) || {});
  } catch (err) {
    if (err instanceof SyntaxError) this.model = {};
  }

  this.proxy = new Proxy(this.model, {
    set(target, property, value) {
      Reflect.set(target, property, value);
      localStorage.setItem(itemKey, JSON.stringify(target));
    },

    deleteProperty(target, property) {
      Reflect.deleteProperty(target, property);
      localStorage.setItem(itemKey, JSON.stringify(target));
    },
  });

  return this.proxy;
}

export default StorageProxy;
