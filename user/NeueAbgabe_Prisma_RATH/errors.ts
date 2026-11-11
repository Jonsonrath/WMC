import type { Request, Response, NextFunction } from 'express';
import { Prisma } from './generated/prisma/client.ts';

// Zentraler Error-Handler: alle Fehler aus next(err) landen hier
export function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction) {
  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // P2025: Datensatz nicht gefunden (update / delete)
    if (err.code === 'P2025') {
      return res.status(404).send({ message: 'Not found' });
    }
    // P2003: Fremdschlüssel verletzt (roleId existiert nicht)
    if (err.code === 'P2003') {
      return res.status(400).send({ message: 'Role does not exist' });
    }
  }

  // Ungültiges JSON im Body
  if (err instanceof SyntaxError && 'body' in err) {
    return res.status(400).send({ message: 'Invalid JSON' });
  }

  console.error(err);
  res.status(500).send({ message: 'Internal server error' });
}
