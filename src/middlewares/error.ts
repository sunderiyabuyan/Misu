export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
 
  constructor(message: string, statusCode: number, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.name = 'AppError';

    Error.captureStackTrace(this, this.constructor);
  }
}

export class AuthError extends AppError {
  constructor(message: string, statusCode = 401) {
    super(message, statusCode);
    this.name = 'AuthenticationError';
  }
}

export class ValidationError extends AppError {
    constructor(message: string, statusCode = 400) {
        super(message, statusCode);
        this.name = 'ValidationError';
    }
}

export class NotFoundError extends AppError {
    constructor(message: string, statusCode = 404) {
        super(message, statusCode);
        this.name = 'NotFoundError';
    }
}

export class AuthorizationError extends AppError {
    constructor(message: string, statusCode = 403) {
        super(message, statusCode);
        this.name = 'AuthorizationError';
    }
}
