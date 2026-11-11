import express, { type Request, type Response, type NextFunction } from 'express';
import { getAllUsers, getUser, createUser, updateUser, deleteUser, type UserInput } from '../services/user.service.ts';

const userRouter = express.Router();

function parseId(value: unknown): number | null {
  const id = Number(value);
  if (!Number.isInteger(id) || id < 1 || id > 2147483647) {
    return null;
  }
  return id;
}

// Liefert eine Fehlermeldung oder null, wenn die Eingabe gültig ist
function validateUser(body: unknown): string | null {
  if (typeof body !== 'object' || body === null) {
    return 'User data missing';
  }
  const user = body as Partial<UserInput>;
  if (typeof user.name !== 'string' || user.name.trim().length === 0 || user.name.length > 100) {
    return 'Name must contain 1 to 100 characters';
  }
  if (typeof user.roleId !== 'number' || parseId(user.roleId) === null) {
    return 'roleId must be a positive integer';
  }
  return null;
}

userRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await getAllUsers();
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
});

userRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  const id = parseId(req.params.id);
  if (id === null) {
    return res.status(400).send({ message: 'Invalid user ID' });
  }

  try {
    const user = await getUser(id);
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
});

userRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
  const error = validateUser(req.body);
  if (error) {
    return res.status(400).send({ message: error });
  }

  try {
    const createdUser = await createUser({ name: req.body.name, roleId: req.body.roleId });
    res.status(201).json(createdUser);
  } catch (err) {
    next(err);
  }
});

userRouter.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  const id = parseId(req.params.id);
  if (id === null) {
    return res.status(400).send({ message: 'Invalid user ID' });
  }

  const error = validateUser(req.body);
  if (error) {
    return res.status(400).send({ message: error });
  }

  try {
    // unbekannte ID -> Prisma wirft P2025 -> 404 im Error-Handler
    const updatedUser = await updateUser(id, { name: req.body.name, roleId: req.body.roleId });
    res.status(200).json(updatedUser);
  } catch (err) {
    next(err);
  }
});

userRouter.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  const id = parseId(req.params.id);
  if (id === null) {
    return res.status(400).send({ message: 'Invalid user ID' });
  }

  try {
    // unbekannte ID -> Prisma wirft P2025 -> 404 im Error-Handler
    await deleteUser(id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default userRouter;
