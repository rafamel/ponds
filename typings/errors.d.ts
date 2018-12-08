/**
 * @module errors
 */

export interface ErrorType {
  id: string;
  message: string;
  status: number;
}

declare const errors: {
  Server: ErrorType;
  NotFound: ErrorType;
  Unauthorized: ErrorType;
  RequestValidation: ErrorType;
  Database: ErrorType;
  DatabaseValidation: ErrorType;
  DatabaseNotFound: ErrorType;
};

export default errors;
