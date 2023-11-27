import { NextFunction, Request, Response } from "express";
import { JwtPayload, verify } from "jsonwebtoken";

//For proper assignment of variable in request
declare global {
  namespace Express {
    interface Request {
      user_id: string;
      username: string;
    }
  }
}

export default async (req: Request, res: Response, next: NextFunction) => {
  //Validate token presence in header
  if (!req.headers.authorization) {
    return res.status(403).json("Missing token.");
  }

  //Extract token from header
  const token = req.headers.authorization as string;

  //Validate token
  const payload = (await verify(
    token,
    process.env.JWT_SECRET || ""
  )) as JwtPayload;

  //Check for existing details
  if (!payload.user_id || !payload.username) {
    return res.status(401).json("Invalid token.");
  }

  //Add details to request
  req.user_id = payload.user_id;
  req.username = payload.username;

  next();
};
