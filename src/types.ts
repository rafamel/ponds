import { Request, Response } from 'express';

export interface IOfType<T> {
  [key: string]: T;
}

export interface IPond {
  data(data: any, req: Request, res: Response): void;
  error(err: Error, req: Request, res: Response): void;
}

export interface ITransforms {
  data?: (data: any) => any;
  error?: (err: Error) => any;
}

export type TPondsHandler<T = any> = (
  req: Request,
  res: Response
) => Promise<T> | T;

export interface IErrorKind {
  readonly id: string;
  readonly message: string;
  readonly status: number;
}

export interface IPublicError {
  message: string | undefined;
  kind: IErrorKind;
  source?: Error;
}
