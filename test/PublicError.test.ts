import PublicError from '~/PublicError';
import ErrorKind from '~/ErrorKind';
import errors from '~/errors';

test(`Instantiates w/ kind object`, () => {
  const kind = { id: 'ID', message: 'MESSAGE', status: 400 };
  const err = new PublicError(kind);

  expect(err.message).toBe('');
  expect(err.kind).toBe(kind);
});
test(`Instantiates w/ kind instance`, () => {
  const kind = new ErrorKind('ID', 'MESSAGE', 400);
  const err = new PublicError(kind);

  expect(err.message).toBe('');
  expect(err.kind).toBe(kind);
});
test(`Instantiates w/ kind string`, () => {
  const err1 = new PublicError('Server');
  const err2 = new PublicError('NotFound');

  expect(err1.message).toBe('');
  expect(err1.kind).toBe(errors.Server);
  expect(err2.message).toBe('');
  expect(err2.kind).toBe(errors.NotFound);
});
test(`Has message when passed`, () => {
  const err = new PublicError('NotFound', null, 'MESSAGE');

  expect(err.message).toBe('MESSAGE');
});
test(`Has source when passed`, () => {
  const e = Error();
  const err1 = new PublicError('NotFound', e);
  const err2 = new PublicError('Server', err1);

  expect(err1.source).toBe(e);
  expect(err2.source).toBe(err1);
});
test(`Has PublicError name`, () => {
  const err = new PublicError('Server');

  expect(err.name).toBe('PublicError');
});
test(`Has self as root when no source is passed`, () => {
  const err = new PublicError('Server');

  expect(err.root).toBe(err);
});
test(`Has self as root when non-PublicError source is passed`, () => {
  const e = Error();
  const err = new PublicError('Server', e);

  expect(err.root).toBe(err);
});
test(`Has source as root when PublicError source is passed`, () => {
  const e = new PublicError('NotFound');
  const err = new PublicError('Server', e);

  expect(err.root).toBe(e);
});
