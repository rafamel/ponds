# Ponds

[![Version](https://img.shields.io/npm/v/ponds.svg)](https://www.npmjs.com/package/ponds)
[![Build Status](https://img.shields.io/travis/rafamel/ponds/master.svg)](https://travis-ci.org/rafamel/ponds)
[![Coverage](https://img.shields.io/coveralls/rafamel/ponds/master.svg)](https://coveralls.io/github/rafamel/ponds)
[![Dependencies](https://img.shields.io/david/rafamel/ponds.svg)](https://david-dm.org/rafamel/ponds)
[![Vulnerabilities](https://img.shields.io/snyk/vulnerabilities/npm/ponds.svg)](https://snyk.io/test/npm/ponds)
[![License](https://img.shields.io/github/license/rafamel/ponds.svg)](https://github.com/rafamel/ponds/blob/master/LICENSE)
[![Types](https://img.shields.io/npm/types/ponds.svg)](https://www.npmjs.com/package/ponds)

> An express middleware for better data and error handling per route.

If you find it useful, consider [starring the project](https://github.com/rafamel/ponds) 💪 and/or following [its author](https://github.com/rafamel) ❤️ -there's more on the way!

## Install

[`npm install ponds`](https://www.npmjs.com/package/ponds)

## Usage

* Ponds
  * [`ponds.set()`](#pondssetname-handler)
  * [`ponds.get()`](#pondsgetname-notfound)
  * [`ponds.exists()`](#pondsexistsname)
  * [`ponds.transform()`](#pondstransformtransform)
* Dispatch
  * [`dispatch()`](#dispatchcb)
  * [`dispatch.all()`](#dispatchallobj)
* Errors
  * [`PublicError`](#publicerror)
  * [`errors`](#errors)

### Basics

Each *pond* corresponds with a way of handling data and errors for a set of your endpoints, and are supposed to handle the response for two scenarios: success and error.

Let's define a couple *ponds* for two different API response formats:

File: `ponds-setup.js`

```javascript
import ponds from 'ponds';

ponds.set('api_1', {
  data(data, req, res) {
    res.json({
      status: 'success',
      data: data
    })
  },
  error(err, req, res) {
    res.json({
      status: 'error',
      error: err
    })
  }
});

ponds.set('api_2', {
  data(data, req, res) {
    res.json({
      data: data,
      error: null
    })
  },
  error(err, req, res) {
    res.json({
      data: null,
      error: err
    })
  }
});
```

Once defined, we can use them in our routes:

File: `app.js`

```javascript
import express from 'express';
import ponds from 'ponds';
import routes from './routes';
import './ponds-setup';

const app = express();

// By default, ponds includes a 404 handler that ships a
// NotFound PublicError (see errors and PublicError)
app.use(routes, ponds.get('api_2'));

// In this case, as we're not doing app.use() for a set of routes,
// we can't have the NotFound error, so we passe `false`as a second param.
app.get('/myRoute', (req, res, next) => {
  // Instead of sending the response,
  // we send our data to next().
  // If it's an error, it'll be handled by our error handler;
  // otherwise it'll go through our data handler
  next({ some: 'data', foo: 'else' });
}, ponds.get('api_1', false));
```

Hence, if we send a get request to `/myRoute`, as it has a next pond `api_1`, we'd get: `{ error: null, data: { some: 'data', foo: 'else' } }`.

File: `routes.js`

```javascript
import { Router } from 'express';

const router = Router();

router.get('/routes/foo', (req, res, next) => {
  // Instead of sending the response,
  // we send our data to next().
  // If it's an error, it'll be handled by our error handler;
  // otherwise it'll go through our data handler
  next({ other: 'data', foo: 'else' });
})

export default router;
```

Hence, as all routes in `routes.js` have a next *pond* `api_2` middleware, if we send a get request to `/routes/foo`, we'd get: `{ status: 'success', data: { other: 'data', foo: 'else' } }`.

<!-- markdownlint-disable MD024 MD022 -->
### Ponds
<!-- markdownlint-enable MD024 MD022 -->

#### `ponds.set(name, handler)`

Sets a *pond* handler.

* `name`: *string,* the name of the handler.
* `handler`: *object,* with keys:
  * `data`: *function,* with signature `(data, req, res)`:
    * `data`: *any,* the data sent to `next` by the controller.
    * `req`: *object,* an express `request` object.
    * `res`: *object,* an express `response` object.
  * `error`: *function,* with signature `(error, req, res)`:
    * `error`: *Error,* an error sent to `next` by the controller.
    * `req`: *object,* an express `request` object.
    * `res`: *object,* an express `response` object.

```javascript
import ponds from 'ponds';

ponds.set('api_1', {
  data(data, req, res) {
    res.json({
      status: 'success',
      data: data
    })
  },
  error(err, req, res) {
    res.json({
      status: 'error',
      error: err
    })
  }
});
```

#### `ponds.get(name, notFound?)`

Returns a previously set handler as an express middleware.

* `name`: *string,* the name of the handler.
* `notFound`: *boolean, optional.* If `true`, `ponds.get()` will return an array, its first element being a handler that will `next()` a [`NotFound`](#errors) [`PublicError`](#publicerror); if `false`, it will return a single final handler for the `next()`'ed data/error. Default: `true`.

```javascript
import ponds from 'ponds';

app.get('/myRoute', (req, res, next) => {
  next({ some: 'data', foo: 'else' });
}, ponds.get('api_1', false));
```

#### `ponds.exists(name)`

Returns `true` if a *pond* has been set, `false` otherwise.

* `name`: *string,* the name of the handler.

```javascript
import ponds from 'ponds';

ponds.exists('api_1'); // true
ponds.exists('foo_pond'); // false
```

#### `ponds.transform(transform)`

Sets a data/error transform that will execute before the `next()`'ed data is received by any *pond* handler. It's particularly useful to reformat errors from different libraries to a [`PublicError`](#publicerror) in order for them to be handled by the *pond* error handler.

* `transform`: *object,* with keys:
  * `data`: *function, optional,* receives and should return any data.
  * `error`: *function, optional,* receives and should return an error.

```javascript
import ponds, { PublicError, errors } from 'ponds';

ponds.transform({
  error(err) {
    if (err instanceof SomeDbLibError) {
      return new PublicError(errors.Database, { err });
    }
    return err;
  }
});
```

### Dispatch

#### `dispatch(cb)`

Wraps a middleware function sending to `next()` any `return`ed data and catching any thrown errors (also sent to `next()`).

* `cb`: *function,* with signature `(req, res)`:
  * `req`: *object,* an express `request` object.
  * `res`: *object,* an express `response` object.

```javascript
import ponds, { dispatch, PublicError, errors } from 'ponds';

const controller = dispatch((req, res) => {
  if (!req.body.somethingRequired) {
    throw new PublicError(
      errors.RequestValidation,
      { info: `Request didn't have "somethingRequired".` }
    );
  }
  return {
    some: 'data',
    foo: 'else'
  };
});

app.get('/myRoute', controller, ponds.get('api_1', false));
```

#### `dispatch.all(obj)`

Same as [`dispatch()`](#dispatchcb) for an object of functions.

* `obj`: *object,* with any number of keys and values of *function*s, with signature `(req, res)`:
  * `req`: *object,* an express `request` object.
  * `res`: *object,* an express `response` object.

```javascript
import ponds, { dispatch, PublicError, errors } from 'ponds';

const controllers = dispatch.all({
  myRoute(req, res) {
    if (!req.body.somethingRequired) {
      throw new PublicError(
        errors.RequestValidation,
        { info: `Request didn't have "somethingRequired".` }
      );
    }
    return {
      some: 'data',
      foo: 'more data'
    };
  },
  otherRoute(req, res) {
    return { some: 'other', foo: 'else' };
  }
});

app.get('/myRoute', controller.myRoute, ponds.get('api_1', false));
app.get('/otherRoute', controllers.otherRoute, ponds.get('api_1', false));
```

### Errors

This library includes an `Error` type to handle additional information regarding the status code, information, and stack.

#### `PublicError`

* `new PublicError(type, additional?)`
  * `type`: *object,* with keys (see the predefined `errors` types below):
    * `id`: *string.*
    * `message`: *string.*
    * `status`: *number.*
  * `additional`: *object, optional,* with keys:
    * `info`: *any, optional,* provides any additional information to be accessed via the `instance.info` property.
    * `err`: *Error, optional,* provides the original error, of any kind, a `PublicError` had as a cause.

* Properties
  * `id`: *string.*
  * `pascalId`: *string,* same as `id` but replacing any letter following `_` for it's uppercase variant. Example: for `some_id`, it's `pascalId` would be `someId`.
  * `message`: *string.*
  * `status`: *number.*
  * `info`: *any.*
  * `child`: *Error,* the error passed as `additional.err` to the `PublicError` instance, if any.
  * `first`: *PublicError,* the first (bottom) error that is an instance of `PublicError` when following the `child` chain.

Because you can store the origin errors a `PublicError` had as a cause (which can be another `PublicError`), it'd be possible to throw several `PublicErrors` in a chain, and access the first via the last thrown.

```javascript
import { dispatch, PublicError, errors } from 'ponds';

async function service() {
  // let's assume something happened
  throw Error('Something happened');
}

async function dbQuery() {
  try {
    return service();
  } catch(err) {
    throw new PublicError(errors.Database, { err });
  }
}

async function controller() {
  try {
    dbQuery()
  } catch(err) {
    throw new PublicError(errors.Server, { err });
  }
}

try {
  controller();
} catch(err) {
  // `err` would be a Server PublicError
  // `err.first` would be a Database PublicError
  // `err.first.child` would be an Error with message "Something happened"
}
```

#### `errors`

`ponds` exports an object with some predefined error types:

* `Server`: `{ id: 'server', message: 'Server error', status: 500 }`,
* `NotFound`: `{ id: 'not_found', message: 'Server Not Found', status: 404 }`,
* `Unauthorized`: `{ id: 'unauthorized', message: "You don't have access to this resource", status: 401 }`,
* `RequestValidation`: `{ id: 'request_validation', message: 'Invalid request', status: 400 }`,
* `Database`: `{ id: 'database', message: 'Database error', status: 500 }`,
* `DatabaseValidation`: `{ id: 'database_validation', message: 'Invalid database request', status: 500 }`,
* `DatabaseNotFound`: `{ id: 'database_not_found', message: 'Item not found in database', status: 500 }`

```javascript
import { PublicError, errors } from 'ponds';

new PublicError(errors.Server, { info: 'Some additional information' });
```
