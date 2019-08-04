/**
 * @module ponds
 */

import { Request, Response, ErrorRequestHandler, Handler } from 'express';

interface PondHandler {
  data(data: any, req: Request, res: Response): void;
  error(err: Error, req: Request, res: Response): void;
}

interface Transform {
  data?: (data: any) => any;
  error?: (err: Error) => any;
}

declare const ponds: {
  set(name: string, handler: PondHandler): void;
  get(
    name: string,
    notFound: boolean
  ): ErrorRequestHandler | Array<Handler | ErrorRequestHandler>;
  exists(name: string): boolean;
  transform(transform: Transform): void;
};

export default ponds;
