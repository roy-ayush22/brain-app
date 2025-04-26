import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { JWT_SECRET } from "./config";

export const userMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const header = req.headers.authorization;
  const decodedData = jwt.verify(header as string, JWT_SECRET);
  if (decodedData) {
    // @ts-ignore
    req.userId = decodedData.id;
    next();
  } else {
    res.json({
      message: "user not signed in",
    });
  }
};
