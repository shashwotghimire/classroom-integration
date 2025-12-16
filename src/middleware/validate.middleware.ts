import { z } from "zod";
import { Request, Response, NextFunction } from "express";

export const validate = (schema: z.ZodType<any>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      req.body = validated.body;
      next();
    } catch (error) {
      next(error);
    }
  };
};
