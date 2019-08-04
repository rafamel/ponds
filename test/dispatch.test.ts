import dispatch from '~/dispatch';

test(`Dispatch returns a middleware, middleware returns a promise`, () => {
  expect(typeof dispatch(() => {}) === 'function');
  expect(dispatch(() => {})(null as any, null as any, () => {})).toHaveProperty(
    'then'
  );
});

test(`Dispatch middleware works`, async () => {
  expect.assertions(3);

  const middleware = dispatch(async (req, res) => {
    return [1, req, res];
  });
  let res: any;
  await middleware(2 as any, 3 as any, (ans) => (res = ans));

  expect(res[0]).toBe(1);
  expect(res[1]).toBe(2);
  expect(res[2]).toBe(3);
});

test(`Dispatch middleware throws on callback throw`, async () => {
  expect.assertions(2);

  const middleware = dispatch(async () => {
    throw Error('M');
  });
  let res: any;
  await middleware(2 as any, 3 as any, (ans) => (res = ans));

  expect(res).toBeInstanceOf(Error);
  expect(res.message).toBe('M');
});

test(`dispatch.all works`, async () => {
  expect.assertions(3);

  const middlewares = dispatch.all({
    async one(req, res) {
      return [1, req, res];
    },
    async two(req, res) {
      return [2, req, res];
    },
    async three() {
      throw Error();
    }
  });

  let one: any;
  let two: any;
  let three: any;
  await middlewares.one(2 as any, 3 as any, (ans) => (one = ans));
  await middlewares.two(3 as any, 4 as any, (ans) => (two = ans));
  await middlewares.three(4 as any, 5 as any, (ans) => (three = ans));

  expect(one).toEqual([1, 2, 3]);
  expect(two).toEqual([2, 3, 4]);
  expect(three).toBeInstanceOf(Error);
});
