import errors from '~/errors';
import ErrorKind from '~/ErrorKind';

test(`Server error exists`, () => {
  expect(errors).toHaveProperty('Server');
});

test(`All errors are instances of ErrorKind`, () => {
  const values = Object.values(errors);

  for (let i = 0; i < values.length; i++) {
    const error = values[i];
    expect(error).toBeInstanceOf(ErrorKind);
  }
});

test(`All errors have required properties`, () => {
  const values = Object.values(errors);

  for (let i = 0; i < values.length; i++) {
    const error = values[i];
    expect(error).toHaveProperty('id');
    expect(error).toHaveProperty('message');
    expect(error).toHaveProperty('status');
  }
});
