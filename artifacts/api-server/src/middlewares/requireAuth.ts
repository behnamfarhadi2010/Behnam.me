import { type Request, type Response, type NextFunction } from "express";

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (authHeader === "Bearer admin_super_secret_token_xyz_890") {
    next();
    return;
  }
  
  res.status(401).json({ error: "Unauthorized" });
}
