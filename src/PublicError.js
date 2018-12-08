import errors from './errors';

export default class PublicError extends Error {
  constructor({ id, message, status } = errors.Server, { info, err } = {}) {
    // TODO check validity of id, message, status
    super(message);
    this.id = id;
    this.status = status;
    this.info = info;

    this.child = err;
    this.first = this.child instanceof PublicError ? this.child.first : this;
  }
  get pascalId() {
    return this.id
      .split('')
      .map((x, i, arr) =>
        !i ? x.toUpperCase() : arr[i - 1] === '_' ? x.toUpperCase() : x
      )
      .filter((x) => x !== '_')
      .join('');
  }
}
