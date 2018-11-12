import errors from './errors';

export default class PublicError extends Error {
  constructor(type, { info, err } = {}) {
    type = errors.get(type || 'Server');
    super(type.message);
    this.type = type;
    this.info = info;
    this.child = err;
    this.first = this.child instanceof PublicError ? this.child.first : this;
  }
  get status() {
    return this.type.status;
  }
  get id() {
    return this.type.id;
  }
}
