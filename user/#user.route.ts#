import express, { type Request, type Response, type NextFunction } from 'express';
import { createUser, getAllUsers, deleteUser, updateUser } from './user.service.ts'

const userRouter = express.Router();


// Router-specific middleware
const timeLog = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log('Time:', Date.now());
  next();
};

userRouter.use(timeLog);


// GET all users
userRouter.get('/', (req: Request, res: Response) => {
  const users = getAllUsers();

  res.status(200).json(users);
});


// CREATE user
userRouter.post('create', (req: Request, res: Response) => {
/*  const user = req.body;

  if (!user) {
    res.status(400).send({
      message: 'User data missing'
    });
  }

  const createdUser = createUser(user);

  res.status(201).json(createdUser);

*/
});


// UPDATE user
userRouter.put('/update/:id', (req: Request, res: Response) => {
  const id = req.params.id;
  const updatedUser = req.body;

  const users = getAllUsers();

  if (!users) {
    return res.status(404).send("USERS NOT FOUND");
  }

  const user = users.find(user => user.id === id);

  if (!user) {
    return res.status(404).send("USER NOT FOUND");
  }

  Object.assign(user, updatedUser);

  res.status(200).json(user);
});


// DELETE user
userRouter.delete('/delete/:id', (req: Request, res: Response) => {
  const id = req.params.id as string;

  const deleted = deleteUser(id);

  if (!deleted) {
    return res.status(404).send({
      message: 'User not found'
    });
  }

  res.status(200).send({
    message: 'User was deleted'
  });
});


export default userRouter;