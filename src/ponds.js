import PublicError from './PublicError';
import errors from './errors';

const ponds = {};

export const transforms = {
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
      next(new PublicError(errors.NotFound));
    },
    (data, req, res, next) => {
      try {
        // Data delivery
        if (!(data instanceof Error)) {
          return pond.data(transforms.data(data), req, res);
        }
      } catch (e) {
        data = e;
      }
      // Error handler
      let err;
      try {
        err = transforms.error(data);
      } catch (e) {
        err = new PublicError(undefined, { err: e });
      }
      if (!(err instanceof PublicError)) {
        err = new PublicError(undefined, { err });
      }
      pond.error(err, req, res);
    }
  ];
}

export default {
  set(name, handler) {
    ponds[name] = handler;
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
