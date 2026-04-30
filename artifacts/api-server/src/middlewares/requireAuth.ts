import { type Request, type Response, type NextFunction } from "express";
<<<<<<< HEAD

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (authHeader === "Bearer admin_super_secret_token_xyz_890") {
    next();
    return;
  }
  
  res.status(401).json({ error: "Unauthorized" });
=======
import { getAuth } from "@clerk/express";

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const auth = getAuth(req);
  const userId = auth?.sessionClaims?.userId || auth?.userId;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
>>>>>>> ef57f6830cf4bd7deb77e1ac4909868f2c238893
}
