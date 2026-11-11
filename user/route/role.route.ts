import express, { type Request, type Response } from 'express';
import { getAllRoles, getRole } from '../db services/role.db.service.ts';
import { ApiError, parseId } from '../errors.ts';

const roleRouter = express.Router();

roleRouter.get('/', async (_req: Request, res: Response) => {
  res.json(await getAllRoles());
});

roleRouter.get('/:id', async (req: Request, res: Response) => {
  const role = await getRole(parseId(req.params.id, 'role'));
  if (!role) throw new ApiError(404, 'ROLE_NOT_FOUND', 'Role not found');
  res.json(role);
});

export default roleRouter;
