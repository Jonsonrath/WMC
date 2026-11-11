import express, { type Request, type Response, type NextFunction } from 'express';
import { getAllRoles, getRole } from '../services/role.service.ts';

const roleRouter = express.Router();

roleRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const roles = await getAllRoles();
    res.status(200).json(roles);
  } catch (err) {
    next(err);
  }
});

roleRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id < 1 || id > 2147483647) {
    return res.status(400).send({ message: 'Invalid role ID' });
  }

  try {
    const role = await getRole(id);
    if (!role) {
      return res.status(404).send({ message: 'Role not found' });
    }
    res.status(200).json(role);
  } catch (err) {
    next(err);
  }
});

export default roleRouter;
