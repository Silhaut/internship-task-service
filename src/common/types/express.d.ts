import 'express';
import { Role } from '@prisma/client';

declare global {
  namespace Express {
    interface User {
      id: string;
      username: string;
      role: Role;
    }

    interface Request {
      user?: User;
    }
  }
}
