/**
 * @module dispatch
 */

import { Request, Response, Handler } from 'express';

type dispatchCb = (req: Request, res: Response) => any;

interface Dispatchers {
  [id: string]: dispatchCb;
}

interface Handlers {
  [id: string]: Handler;
}

declare function dispatch(cb: dispatchCb): Handler;
// tslint:disable-next-line:no-namespace
declare namespace dispatch {
  export function all(obj: Dispatchers): Handlers;
}

export default dispatch;
