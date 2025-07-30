//Provide a consistent error structure including status codes, messages, error arrays, and stack traces.
class ApiError extends Error {
  constructor(
    statusCode,
    message = "something went wrong",
    stack = "",
    errors = []
  ) {
    super(message),
      (this.statusCode = statusCode),
      (this.data = null),
      (this.message = message),
      (this.success = false),
      (this.errors = errors);

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

// error.middleware.js
const globalErrorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  return res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    errors: err.errors || [],
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};

export { ApiError, globalErrorHandler };
