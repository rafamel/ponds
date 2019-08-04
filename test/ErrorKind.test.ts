import ErrorKind from '~/ErrorKind';

test(`Creates IErrorKind object`, () => {
  const error = new ErrorKind('ID', 'MESSAGE', 400);
  expect(error).toHaveProperty('id', 'ID');
  expect(error).toHaveProperty('message', 'MESSAGE');
  expect(error).toHaveProperty('status', 400);
});
