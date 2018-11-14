import { PublicError, errors } from '../src';

describe(`- Basic features`, () => {
  test(`Creates errors w/ basic getters (message, status, id)`, () => {
    const err = new PublicError(errors.NotFound);

    expect(err.message).toBe('Not Found');
    expect(err.status).toBe(404);
    expect(err.id).toBe('not_found');
    expect(err.pascalId).toBe('NotFound');
  });
  test(`Creates errors w/ info`, () => {
    const err = new PublicError('NotFound', { info: 'Some info' });

    expect(err.info).toBe('Some info');
  });
  test(`Default type is Server`, () => {
    const err1 = new PublicError();
    const err2 = new PublicError(undefined);

    expect(err1.status).toBe(500);
    expect(err1.id).toBe('server');
    expect(err1.pascalId).toBe('Server');
    expect(err2.status).toBe(500);
    expect(err2.id).toBe('server');
    expect(err2.pascalId).toBe('Server');
  });
});

describe(`- PublicError.first`, () => {
  test(`First is child when err is a PublicError`, () => {
    const err1 = new PublicError(errors.NotFound);
    const err2 = new PublicError(errors.NotFound, { err: err1 });

    expect(err2.first).toBe(err1);
  });
  test(`First is self when err is not a PublicError`, () => {
    const err1 = Error('Some error');
    const err2 = new PublicError(errors.NotFound, { err: err1 });

    expect(err2.first).toBe(err2);
  });
  test(`First traverses until first (wo/ Error)`, () => {
    const err1 = new PublicError();
    const err2 = new PublicError(undefined, { err: err1 });
    const err3 = new PublicError(undefined, { err: err2 });
    const err4 = new PublicError(undefined, { err: err3 });
    const err5 = new PublicError(undefined, { err: err4 });

    expect(err5.first).toBe(err1);
  });
  test(`First traverses until first (w/ Error)`, () => {
    const err0 = Error('Some error');
    const err1 = new PublicError(undefined, { err: err0 });
    const err2 = new PublicError(undefined, { err: err1 });
    const err3 = new PublicError(undefined, { err: err2 });
    const err4 = new PublicError(undefined, { err: err3 });
    const err5 = new PublicError(undefined, { err: err4 });

    expect(err5.first).toBe(err1);
    expect(err5.first.child).toBe(err0);
  });
});
