const create = (id, message, status) => ({ id, message, status });

export default {
  Server: create('server', 'Server error', 500),
  NotFound: create('not_found', 'Not Found', 404),
  Unauthorized: create(
    'unauthorized',
    "You don't have access to this resource",
    401
  ),
  RequestValidation: create('request_validation', 'Invalid request', 400),
  Database: create('database', 'Database Error', 500),
  DatabaseValidation: create(
    'database_validation',
    'Invalid database request',
    500
  ),
  DatabaseNotFound: create(
    'database_not_found',
    'Item not found in database',
    500
  )
};
