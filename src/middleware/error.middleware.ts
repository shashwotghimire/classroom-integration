import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = "Error processing request";
  let error = "Internal server error";
  let validationErrors: any = undefined;

  if (err instanceof ZodError) {
    statusCode = 400;
    return res.status(statusCode).json({
      success: false,
      message: "Error processing request",
      error: "Invalid request payload",
      validationErrors: err.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      })),
    });
  } else if (err?.code && err?.meta) {
    statusCode = 400;
    message = "Database error";
    error = err.message;
  } else if (err.statusCode) {
    statusCode = err.statusCode;
    message = err.message || message;
    error = err.details || err.error || "An error occurred";
  } else {
    console.error("Unknown error: ", err);
    error = err.message || err.stack || "Internal server error";
  }

  return res.status(statusCode).json({
    success: false,
    message,
    error,
    ...(validationErrors ? { validationErrors } : {}),
  });
};
