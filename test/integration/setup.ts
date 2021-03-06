import express from 'express';
import ponds, { dispatch, PublicError } from '~/index';

ponds.transform({
  data(data) {
    if (data === 'THROW') throw new PublicError('Unauthorized');
    return { tData: data };
  },
  error(err) {
    if (err.message === 'THROW') throw new Error();
    if (err.message === 'TRANSFORM') {
      return new PublicError('Unauthorized', err);
    }
    return err;
  }
});

ponds.set('one', {
  data(data, req, res) {
    res.json({ status: 'success', one: data });
  },
  error(err: PublicError, req, res) {
    res
      .status(err.root.kind.status)
      .json({ status: 'error', one: err.root.kind.id });
  }
});

ponds.set('two', {
  data(data, req, res) {
    res.json({ status: 'success', two: data });
  },
  error(err: PublicError, req, res) {
    res
      .status(err.root.kind.status)
      .json({ status: 'error', two: err.root.kind.id });
  }
});

// Initialize Express
const app = express();

app.get(
  '/one/data',
  dispatch(async () => {
    return 'DATA';
  }),
  ponds.get('one', false)
);
app.get(
  '/one/error_transform',
  dispatch(async () => {
    throw Error('TRANSFORM');
  }),
  ponds.get('one', false)
);
app.get(
  '/one/error',
  dispatch(async () => {
    throw Error('Error');
  }),
  ponds.get('one', false)
);
app.get(
  '/one/public_error',
  dispatch(async () => {
    return new PublicError('Unauthorized');
  }),
  ponds.get('one', false)
);

app.get(
  '/two/data',
  dispatch(async () => {
    return 'DATA';
  })
);
app.get(
  '/two/data_transform_throw',
  dispatch(async () => {
    return 'THROW';
  })
);
app.get(
  '/two/error_transform_throw',
  dispatch(async () => {
    return Error('THROW');
  })
);
app.get(
  '/two/error',
  dispatch(async () => {
    throw Error('Error');
  })
);

app.use(ponds.get('two'));

export default app;
