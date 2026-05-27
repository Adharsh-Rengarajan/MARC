export class AppError extends Error {
  constructor(status, code, message) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

export const notFound = (req, res) => {
  res.status(404).json({ success: false, code: "NOT_FOUND", message: `Route ${req.method} ${req.originalUrl} not found` });
};

export const errorHandler = (err, req, res, next) => {
  if (res.headersSent) return next(err);
  if (err instanceof AppError) {
    return res.status(err.status).json({ success: false, code: err.code, message: err.message });
  }
  if (err.name === "ValidationError") {
    return res.status(422).json({ success: false, code: "VALIDATION_ERROR", message: err.message });
  }
  if (err.code === 11000) {
    return res.status(409).json({ success: false, code: "DUPLICATE", message: "Duplicate key", key: err.keyValue });
  }
  console.error(err);
  res.status(500).json({ success: false, code: "SERVER_ERROR", message: err.message || "Internal server error" });
};
