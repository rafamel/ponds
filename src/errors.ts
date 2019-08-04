import ErrorKind from './ErrorKind';

export default {
  Server: new ErrorKind('Server', 'Server error', 500),
  NotFound: new ErrorKind('NotFound', 'Not Found', 404),
  Unauthorized: new ErrorKind(
    'Unauthorized',
    "You don't have access to this resource",
    401
  ),
  RequestValidation: new ErrorKind('RequestValidation', 'Invalid request', 400),
  DatabaseValidation: new ErrorKind(
    'DatabaseValidation',
    'Invalid database request',
    400
  ),
  Database: new ErrorKind('Database', 'Database Error', 500),
  DatabaseNotFound: new ErrorKind(
    'DatabaseNotFound',
    'Item not found in database',
    500
  )
};
