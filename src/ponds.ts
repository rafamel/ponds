import PublicError from './PublicError';
import { Handler, ErrorRequestHandler } from 'express';
import { ITransforms, IOfType, IPond } from './types';

const ponds: IOfType<IPond> = {};

export const transforms: Required<ITransforms> = {
  data(data) {
    return data;
  },
  error(err) {
    return err;
  }
};

function createHandler(pond: IPond): [Handler, ErrorRequestHandler] {
  return [
    (req, res, next) => {
      // 404 Error
      next(new PublicError('NotFound'));
    },
    (data, req, res, _next) => {
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
        err = new PublicError('Server', e);
      }
      if (!(err instanceof PublicError)) {
        err = new PublicError('Server', err);
      }
      pond.error(err, req, res);
    }
  ];
}

export default {
  set(name: string, pond: IPond): void {
    ponds[name] = pond;
  },
  get(
    name: string,
    notFound: boolean = true
  ): [Handler, ErrorRequestHandler] | [ErrorRequestHandler] {
    const pond = ponds[name];
    if (!pond) throw Error(`Pond ${name} doesn't exist in ponds registry.`);

    const handler = createHandler(pond);
    return notFound ? handler : [handler[1]];
  },
  exists(name: string): boolean {
    return ponds.hasOwnProperty(name);
  },
  transform({ data, error }: ITransforms): void {
    if (data) transforms.data = data;
    if (error) transforms.error = error;
  }
};
