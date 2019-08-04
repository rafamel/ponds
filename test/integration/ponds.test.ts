import app from './setup';
import request from 'supertest';
import ponds from '~/index';

test(`Setup ponds have been registered`, () => {
  expect(ponds.exists('one')).toBe(true);
  expect(ponds.exists('two')).toBe(true);
});

test(`Handlers work`, async () => {
  expect.assertions(6);

  await request(app)
    .get('/one/data')
    .send()
    .then(({ status, body }) => {
      expect(status).toBe(200);
      expect(body).toHaveProperty('one');
    });
  await request(app)
    .get('/one/error')
    .send()
    .then(({ body }) => {
      expect(body).toHaveProperty('one');
    });
  await request(app)
    .get('/two/data')
    .send()
    .then(({ status, body }) => {
      expect(status).toBe(200);
      expect(body).toHaveProperty('two');
    });
  await request(app)
    .get('/two/error')
    .send()
    .then(({ body }) => {
      expect(body).toHaveProperty('two');
    });
});

test(`Transforms work`, async () => {
  expect.assertions(6);

  await request(app)
    .get('/one/error_transform')
    .send()
    .then(({ status }) => {
      expect(status).toBe(401);
    });
  await request(app)
    .get('/one/error')
    .send()
    .then(({ status }) => {
      expect(status).toBe(500);
    });
  await request(app)
    .get('/one/data')
    .send()
    .then(({ status, body }) => {
      expect(status).toBe(200);
      expect(body.one).toHaveProperty('tData');
    });
  await request(app)
    .get('/two/data')
    .send()
    .then(({ status, body }) => {
      expect(status).toBe(200);
      expect(body.two).toHaveProperty('tData');
    });
});

test(`Default not found works`, async () => {
  expect.assertions(6);

  await request(app)
    .get('/one/not')
    .send()
    .then(({ status, body }) => {
      expect(status).toBe(404);
      expect(body.two).toBe('NotFound');
    });
  await request(app)
    .get('/two/not')
    .send()
    .then(({ status, body }) => {
      expect(status).toBe(404);
      expect(body.two).toBe('NotFound');
    });
  await request(app)
    .get('/not')
    .send()
    .then(({ status, body }) => {
      expect(status).toBe(404);
      expect(body.two).toBe('NotFound');
    });
});

test(`Error messages work (w/ both throw & return)`, async () => {
  expect.assertions(6);

  await request(app)
    .get('/one/error')
    .send()
    .then(({ status, body }) => {
      expect(status).toBe(500);
      expect(body.one).toBe('Server');
    });
  await request(app)
    .get('/one/public_error')
    .send()
    .then(({ status, body }) => {
      expect(status).toBe(401);
      expect(body.one).toBe('Unauthorized');
    });
  await request(app)
    .get('/two/error')
    .send()
    .then(({ status, body }) => {
      expect(status).toBe(500);
      expect(body.two).toBe('Server');
    });
});

test(`Data handler works`, async () => {
  expect.assertions(2);

  await request(app)
    .get('/one/data')
    .send()
    .then(({ body }) => {
      expect(body.one.tData).toBe('DATA');
    });
  await request(app)
    .get('/two/data')
    .send()
    .then(({ body }) => {
      expect(body.two.tData).toBe('DATA');
    });
});

test(`Returns error when transforms throws`, async () => {
  expect.assertions(4);

  await request(app)
    .get('/two/data_transform_throw')
    .send()
    .then(({ status, body }) => {
      expect(status).toBe(401);
      expect(body.two).toBe('Unauthorized');
    });
  await request(app)
    .get('/two/error_transform_throw')
    .send()
    .then(({ status, body }) => {
      expect(status).toBe(500);
      expect(body.two).toBe('Server');
    });
});
