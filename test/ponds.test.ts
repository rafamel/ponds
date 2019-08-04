import ponds, { transforms } from '~/ponds';

describe(`ponds`, () => {
  test(`sets pond and exists`, () => {
    expect(() => ponds.set('foo', {} as any)).not.toThrow();
    expect(ponds.exists('foo')).toBe(true);
    expect(ponds.exists('notfoo')).toBe(false);
  });
  test(`gets pond as array w/ not found handler, and as function wo/ it`, () => {
    const pond1 = ponds.get('foo');
    const pond2 = ponds.get('foo', true);
    const pond3 = ponds.get('foo', false);

    expect(Array.isArray(pond1)).toBe(true);
    expect(pond1).toHaveLength(2);

    expect(Array.isArray(pond2)).toBe(true);
    expect(pond2).toHaveLength(2);

    expect(Array.isArray(pond3)).toBe(true);
    expect(pond3).toHaveLength(1);
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
    const data = {};
    const err = Error();
    expect(transforms.data(data)).toBe(data);
    expect(transforms.error(err)).toBe(err);
  });
  test(`ponds.transform() mutates transform`, () => {
    const data = (a: any): any => a;
    const error = (b: any): any => b;

    ponds.transform({ data });
    expect(transforms.data).toBe(data);

    ponds.transform({ error });
    expect(transforms.error).toBe(error);
  });
});
