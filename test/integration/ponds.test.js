import app from './setup';
import request from 'supertest';
import ponds from '../../src';

test(`Setup ponds have been registered`, () => {
  expect(ponds.exists('one')).toBe(true);
  expect(ponds.exists('two')).toBe(true);
});

test(`Handlers work`, async () => {
  expect.assertions(6);

  await request(app)
    .get('/one/data')
    .send()
    .then(({ statusCode, body }) => {
      expect(statusCode).toBe(200);
      expect(body).toHaveProperty('one');
    });
  await request(app)
    .get('/one/error')
    .send()
    .then(({ statusCode, body }) => {
      expect(body).toHaveProperty('one');
    });
  await request(app)
    .get('/two/data')
    .send()
    .then(({ statusCode, body }) => {
      expect(statusCode).toBe(200);
      expect(body).toHaveProperty('two');
    });
  await request(app)
    .get('/two/error')
    .send()
    .then(({ statusCode, body }) => {
      expect(body).toHaveProperty('two');
    });
});

test(`Transforms work`, async () => {
  expect.assertions(6);

  await request(app)
    .get('/one/error_transform')
    .send()
    .then(({ statusCode, body }) => {
      expect(statusCode).toBe(401);
    });
  await request(app)
    .get('/one/error')
    .send()
    .then(({ statusCode, body }) => {
      expect(statusCode).toBe(500);
    });
  await request(app)
    .get('/one/data')
    .send()
    .then(({ statusCode, body }) => {
      expect(statusCode).toBe(200);
      expect(body.one).toHaveProperty('tData');
    });
  await request(app)
    .get('/two/data')
    .send()
    .then(({ statusCode, body }) => {
      expect(statusCode).toBe(200);
      expect(body.two).toHaveProperty('tData');
    });
});

test(`Default not found works`, async () => {
  expect.assertions(6);

  await request(app)
    .get('/one/not')
    .send()
    .then(({ statusCode, body }) => {
      expect(statusCode).toBe(404);
      expect(body.two).toBe('not_found');
    });
  await request(app)
    .get('/two/not')
    .send()
    .then(({ statusCode, body }) => {
      expect(statusCode).toBe(404);
      expect(body.two).toBe('not_found');
    });
  await request(app)
    .get('/not')
    .send()
    .then(({ statusCode, body }) => {
      expect(statusCode).toBe(404);
      expect(body.two).toBe('not_found');
    });
});

test(`Error messages work (w/ both throw & return)`, async () => {
  expect.assertions(6);

  await request(app)
    .get('/one/error')
    .send()
    .then(({ statusCode, body }) => {
      expect(statusCode).toBe(500);
      expect(body.one).toBe('server');
    });
  await request(app)
    .get('/one/public_error')
    .send()
    .then(({ statusCode, body }) => {
      expect(statusCode).toBe(401);
      expect(body.one).toBe('unauthorized');
    });
  await request(app)
    .get('/two/error')
    .send()
    .then(({ statusCode, body }) => {
      expect(statusCode).toBe(500);
      expect(body.two).toBe('server');
    });
});

test(`Data handler works`, async () => {
  expect.assertions(2);

  await request(app)
    .get('/one/data')
    .send()
    .then(({ statusCode, body }) => {
      expect(body.one.tData).toBe('DATA');
    });
  await request(app)
    .get('/two/data')
    .send()
    .then(({ statusCode, body }) => {
      expect(body.two.tData).toBe('DATA');
    });
});

test(`Returns error when transforms throws`, async () => {
  expect.assertions(4);

  await request(app)
    .get('/two/data_transform_throw')
    .send()
    .then(({ statusCode, body }) => {
      expect(statusCode).toBe(401);
      expect(body.two).toBe('unauthorized');
    });
  await request(app)
    .get('/two/error_transform_throw')
    .send()
    .then(({ statusCode, body }) => {
      expect(statusCode).toBe(500);
      expect(body.two).toBe('server');
    });
});
