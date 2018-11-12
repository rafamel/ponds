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
  return Object.entries(obj).reduce((acc, [key, callback]) => {
    acc[key] = dispatch(callback);
    return acc;
  }, {});
};

export default dispatch;
