import ponds, { transforms } from '~/ponds';

describe(`ponds`, () => {
  test(`sets pond + exists`, () => {
    expect(() => ponds.set('foo', {})).not.toThrow();
    expect(ponds.exists('foo')).toBe(true);
    expect(ponds.exists('notfoo')).toBe(false);
  });
  test(`gets pond as array w/ not found handler, and as function wo/ it`, () => {
    expect(Array.isArray(ponds.get('foo', true))).toBe(true);
    expect(Array.isArray(ponds.get('foo'))).toBe(true);
    expect(typeof ponds.get('foo', false)).toBe('function');
  });
  test(`get throws when pond doesn't exist`, () => {
    expect(() => ponds.get('notfoo')).toThrowError();
  });
});

describe(`transforms`, () => {
  test(`default transforms have data an error properties`, () => {
    expect(typeof transforms.data).toBe('function');
    expect(typeof transforms.error).toBe('function');
  });
  test(`default transforms return input`, () => {
    const input = {};
    expect(transforms.data(input)).toBe(input);
    expect(transforms.error(input)).toBe(input);
  });
  test(`ponds.transform() mutates transform`, () => {
    const data = {};
    const error = {};

    ponds.transform({ data });
    expect(transforms.data).toBe(data);

    ponds.transform({ error });
    expect(transforms.error).toBe(error);
  });
});
