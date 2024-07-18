import { NotFoundError } from 'errors/not-found-error';
import { NextFunction } from 'express';

export const ensureEntityExists = <T>(entity: T | null, next: NextFunction): entity is T => {
  if (entity == null) {
    next(new NotFoundError());
    return false;
  }
  return true;
};
