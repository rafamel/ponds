import { errors } from '../src';

test(`Server error exists`, () => {
  expect(errors).toHaveProperty('Server');
});

test(`All errors have id, message, status`, () => {
  const values = Object.values(errors);

  for (let i = 0; i < values.length; i++) {
    const error = values[i];
    expect(error).toHaveProperty('id');
    expect(error).toHaveProperty('message');
    expect(error).toHaveProperty('status');
  }
});
