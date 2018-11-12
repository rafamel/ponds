const types = {};

export default {
  set(id, message, status = 500) {
    types[id] = { id, message, status };
    return types;
  },
  get(id) {
    const err = types[id];
    if (!err) throw Error(`Error ${id} doesn't exist in ponds registry.`);
    return err;
  },
  exists(id) {
    return types.hasOwnProperty(id);
  }
};
