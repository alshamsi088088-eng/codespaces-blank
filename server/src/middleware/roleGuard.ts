
import { Request, Response, NextFunction } from 'express';

export function roleGuard(role: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as any;
    if (!user || user.role !== role) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  };
}
