function dispatch(cb) {
  return async (req, res, next) => {
    try {
      next(await cb(req, res));
    } catch (err) {
      next(err);
    }
  };
}

dispatch.all = function dispatchAll(obj) {
  Object.keys(obj).forEach((key) => {
    const cb = obj[key];
    obj[key] = dispatch(cb);
  });
  return obj;
};

export default dispatch;
