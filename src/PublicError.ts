import errors from './errors';
import { IErrorKind, IPublicError } from './types';

export default class PublicError extends Error implements IPublicError {
  public kind: IErrorKind;
  public source?: Error;
  public constructor(
    kind: IErrorKind | keyof typeof errors,
    source?: Error | null,
    message?: string
  ) {
    super(message);
    this.kind = typeof kind === 'string' ? errors[kind] : kind;
    this.source = source || undefined;
  }
  public get name(): string {
    return 'PublicError';
  }
  public get root(): PublicError {
    return this.source instanceof PublicError && this.source !== this
      ? this.source.root
      : this;
  }
}
