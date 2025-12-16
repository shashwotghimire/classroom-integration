import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.utils";
import { JwtPayload } from "jsonwebtoken";

interface TokenPayload extends JwtPayload {
  id: string;
  email: string;
}

export interface AuthRequest extends Request {
  user: TokenPayload;
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeaders = req.headers.authorization;
    if (!authHeaders || !authHeaders.startsWith("Bearer ")) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
        error: "Missing/Invalid token or expired",
      });
      return;
    }
    const parts = authHeaders.split(" ");
    const token = parts[1];
    if (!token) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
        error: "Missing token",
      });
      return;
    }
    const decoded = verifyToken(token) as TokenPayload;
    (req as AuthRequest).user = decoded;
    next();
  } catch (e) {
    res.status(401).json({
      success: false,
      message: "Unauthorized",
      error: "Token expired or invalid",
    });
    return;
  }
};
