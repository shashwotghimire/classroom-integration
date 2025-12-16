import jwt from "jsonwebtoken";

interface TokenPayload {
  id: string;
  email: string;
}
export const signToken = (payload: TokenPayload) => {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "1d" });
};

export const verifyToken = (token: string): TokenPayload => {
  return jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
};
