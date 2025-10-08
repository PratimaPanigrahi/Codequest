// middleware/errorMiddleware.js

// Custom error class (so we can throw specific errors with status codes)
export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // flag to identify known errors
  }
}

// Main error handler
export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Handle specific Mongoose errors
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
  }

  if (err.code && err.code === 11000) {
    // Duplicate key error (common in MongoDB for unique fields like email)
    statusCode = 400;
    message = `Duplicate field value entered: ${JSON.stringify(err.keyValue)}`;
  }

  // Handle invalid ObjectId error (Mongoose CastError)
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // Build response object
  const response = {
    success: false,
    message,
  };

  // Show stack trace only in development
  if (process.env.NODE_ENV !== "production") {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};
