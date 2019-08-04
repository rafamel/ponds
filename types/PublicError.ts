/**
 * @module PublicError
 */

import { ErrorType } from './errors';

interface AdditionalData {
  info: any;
  err: Error;
}

export declare class PublicError extends Error {
  public id: string;
  public message: string;
  public status: number;
  public pascalId: string;
  public first: PublicError;
  public child?: Error;
  public info?: string;
  constructor(type: ErrorType, additional: AdditionalData);
}
