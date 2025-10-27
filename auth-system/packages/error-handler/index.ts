export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly details?: any;

  constructor(
    message: string,
    statusCode: number,
    isOperational = true,
    detail?: any
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.details = this.details;
    Error.captureStackTrace(this);
  }
}

// not found error
export class NotFoundError extends AppError {
  constructor(message: "Resources not found") {
    super(message, 404);
  }
}

// validation error
export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super(message, 400, true, details);
  }
}

export class AuthError extends AppError {
  constructor(message: string) {
    super(message, 401);
  }
}

// database error
export class DatabaseError extends AppError {
  constructor(messgae: "Data-base error") {
    super(messgae, 500);
  }
}

// rate limit error
export class RateLimitError extends AppError {
  constructor(message: "Too many request, Please try again later") {
    super(message, 429);
  }
}
