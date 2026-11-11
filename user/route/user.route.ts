import express, { type Request, type Response } from 'express';
import { getAllUsers, createUser, deleteUser, updateUser, getUser } from '../db services/user.db.service.ts';
import { ApiError, parseId } from '../errors.ts';

const userRouter = express.Router();

function userInput(body: unknown): { name: string; roleId: number } {
  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    throw new ApiError(400, 'INVALID_USER', 'Name and roleId are required');
  }
  const { name, roleId } = body as Record<string, unknown>;
  if (typeof name !== 'string' || name.trim().length === 0 || name.length > 100) {
    throw new ApiError(400, 'INVALID_USER', 'Name must contain 1 to 100 characters');
  }
  if (typeof roleId !== 'number' || !Number.isInteger(roleId) || roleId < 1 || roleId > 2147483647) {
    throw new ApiError(400, 'INVALID_USER', 'roleId must be a positive integer');
  }
  return { name, roleId };
}

userRouter.get('/', async (_req: Request, res: Response) => {
  res.json(await getAllUsers());
});

userRouter.get('/:id', async (req: Request, res: Response) => {
  const user = await getUser(parseId(req.params.id, 'user'));
  if (!user) throw new ApiError(404, 'USER_NOT_FOUND', 'User not found');
  res.json(user);
});

userRouter.post('/create', async (req: Request, res: Response) => {
  res.status(201).json(await createUser(userInput(req.body)));
});

userRouter.put('/update/:id', async (req: Request, res: Response) => {
  const id = parseId(req.params.id, 'user');
  const input = userInput(req.body);
  res.json(await updateUser({ id, ...input }));
});

userRouter.delete('/delete/:id', async (req: Request, res: Response) => {
  const result = await deleteUser(parseId(req.params.id, 'user'));
  if (result.count === 0) throw new ApiError(404, 'USER_NOT_FOUND', 'User not found');
  res.json({ message: 'User was deleted' });
});

export default userRouter;
