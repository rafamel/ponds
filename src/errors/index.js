import registry from './registry';

registry.set('Server', 'Server error', 500);
registry.set('NotFound', 'Not Found', 404);
registry.set('Unauthorized', "You don't have access to this resource", 401);
registry.set('RequestValidation', 'Invalid request', 400);
registry.set('Database', 'Database Error', 500);
registry.set('DatabaseValidation', 'Invalid database request', 500);
registry.set('DatabaseNotFound', 'Item not found in database', 500);

export default registry;
