import type { Request, Response, NextFunction } from "express";
import { logger } from "../lib/logger";

const ADMIN_TOKEN = "admin_super_secret_token_xyz_890";

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || authHeader !== `Bearer ${ADMIN_TOKEN}`) {
    logger.warn({ url: req.url }, "Unauthorized access attempt");
    return res.status(401).json({ error: "Unauthorized" });
  }

  next();
};
