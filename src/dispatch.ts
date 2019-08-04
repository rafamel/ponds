import { Handler } from 'express';
import { TPondsHandler, IOfType } from './types';
import { ensure } from 'errorish';

export default dispatch;
dispatch.all = dispatchAll;
dispatch.errors = dispatchErrors;
dispatchAll.errors = dispatchAllErrors;

export function dispatch(handler: TPondsHandler): Handler {
  return async (req, res, next) => {
    try {
      next(await handler(req, res));
    } catch (err) {
      next(ensure(err));
    }
  };
}

// TODO test
export function dispatchErrors(handler: Handler): Handler {
  return async (req, res, next) => {
    try {
      await handler(req, res, next);
    } catch (err) {
      next(ensure(err));
    }
  };
}

export function dispatchAll<T extends IOfType<TPondsHandler>>(
  handlers: T
): { [P in keyof T]: Handler } {
  const entries: Array<[keyof T, TPondsHandler]> = Object.entries(handlers);
  const response: Partial<{ [P in keyof T]: Handler }> = {};

  for (let [key, value] of entries) {
    response[key] = dispatch(value);
  }

  return response as { [P in keyof T]: Handler };
}

// TODO test
export function dispatchAllErrors<T extends IOfType<Handler>>(
  handlers: T
): { [P in keyof T]: Handler } {
  const entries: Array<[keyof T, Handler]> = Object.entries(handlers);
  const response: Partial<{ [P in keyof T]: Handler }> = {};

  for (let [key, value] of entries) {
    response[key] = dispatchErrors(value);
  }

  return response as { [P in keyof T]: Handler };
}
