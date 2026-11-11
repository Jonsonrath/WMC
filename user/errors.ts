import type { ErrorRequestHandler } from 'express';
import { Prisma } from './generated/prisma/client.ts';

export class ApiError extends Error {
  status: number;
  code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

export function parseId(value: string | string[], resource: string): number {
  if (typeof value !== 'string' || !/^[0-9]+$/.test(value)) {
    throw new ApiError(400, 'INVALID_ID', `Invalid ${resource} ID`);
  }
  const id = Number(value);
  if (!Number.isSafeInteger(id) || id < 1 || id > 2147483647) {
    throw new ApiError(400, 'INVALID_ID', `Invalid ${resource} ID`);
  }
  return id;
}

export const errorHandler: ErrorRequestHandler = (err: unknown, _req, res, next) => {
  if (res.headersSent) {
    next(err);
    return;
  }

  if (err instanceof ApiError) {
    res.status(err.status).json({ error: { code: err.code, message: err.message } });
    return;
  }
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2003') {
      res.status(400).json({ error: { code: 'INVALID_ROLE', message: 'Role does not exist' } });
      return;
    }
    if (err.code === 'P2025') {
      res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Resource not found' } });
      return;
    }
  }
  if (typeof err === 'object' && err !== null && 'type' in err) {
    if (err.type === 'entity.parse.failed') {
      res.status(400).json({ error: { code: 'INVALID_JSON', message: 'Invalid JSON body' } });
      return;
    }
    if (err.type === 'entity.too.large') {
      res.status(413).json({ error: { code: 'PAYLOAD_TOO_LARGE', message: 'Request body is too large' } });
      return;
    }
  }
  console.error(err);
  res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } });
};
