import { IErrorKind } from './types';

export default class ErrorKind implements IErrorKind {
  public id: string;
  public message: string;
  public status: number;
  public constructor(id: string, message: string, status: number) {
    this.id = id;
    this.message = message;
    this.status = status;
  }
}
