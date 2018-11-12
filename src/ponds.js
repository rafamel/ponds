import PublicError from './public-error';

const ponds = {};

const transforms = {
  data(data) {
    return data;
  },
  error(err) {
    return err;
  }
};

function createHandler(pond) {
  return [
    (req, res, next) => {
      // 404 Error
      next(new PublicError('NotFound'));
    },
    (data, req, res, next) => {
      try {
        // Data delivery
        if (!(data instanceof Error)) {
          return pond.data(transforms.data(data) || data, req, res);
        }
      } catch (e) {
        data = e;
      }
      // Error handler
      let err;
      try {
        err = transforms.error(data) || data;
      } catch (e) {
        err = new PublicError(null, { err: e });
      }
      if (!(err instanceof PublicError)) {
        err = new PublicError(null, { err });
      }
      pond.error(err, req, res);
    }
  ];
}

export default {
  set(name, obj) {
    ponds[name] = obj;
  },
  get(name, notFound = true) {
    const pond = ponds[name];
    if (!pond) throw Error(`Pond ${name} doesn't exist in ponds registry.`);
    const handler = createHandler(pond);
    return notFound ? handler : handler[1];
  },
  exists(name) {
    return ponds.hasOwnProperty(name);
  },
  transform({ data, error }) {
    if (data) transforms.data = data;
    if (error) transforms.error = error;
  }
};
