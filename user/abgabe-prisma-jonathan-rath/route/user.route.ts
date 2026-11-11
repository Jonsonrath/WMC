import express, { type Request, type Response, type NextFunction} from 'express';
import {getAllUsers, createUser, deleteUser, updateUser, getUser, exists} from '../db services/user.db.service.ts';
//import { createUser, deleteUser, updateUser } from './user.service.ts';

const userRouter = express.Router();


userRouter.use((req: Request, res: Response, next: NextFunction) => {
    console.log('Time:', Date.now());
    next();
});



userRouter.get('/', async (req: Request, res: Response) => {
//  const users = getAllUsers();

//  res.status(200).json(users);

  try {
    const users = await getAllUsers();
    res.send(users);
  } catch (err) {
    console.error(err);
    res.status(500).send('Database error');
  }
});

userRouter.post('/create', async (req: Request, res: Response) => {
/*  const user = req.body;

  if (!user) {
    res.status(400).send({
      message: 'User data missing'
    });
  }

  const createdUser = createUser(user);

  res.status(201).json(createdUser);

*/

  const user = req.body;

  try {
    const createdUser = await createUser(user);
    res.status(201).send(createdUser);
  } catch (err) {
    console.error(err);
    res.status(500).send('Database error');
  }

});

userRouter.put('/update/:id', async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const updatedUser = req.body;

    if (!Number.isInteger(id) || id < 1) {
        res.status(400).send("Invalid user ID");
        return;
    }

    try {
        const user = await getUser(id);
        if (!user) {
            res.status(404).send("USER NOT FOUND");
            return;
        }

        const result = await updateUser({
            id,
            name: updatedUser.name,
            roleId: updatedUser.roleId,
        });
        res.status(200).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).send('Database error');
    }
});


userRouter.delete('/delete/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id < 1) {
    res.status(400).send("Invalid user ID");
    return;
  }
  
  try {
    if (!await exists(id)) {
      res.status(404).send("User not found");
      return;
    }

    await deleteUser(id);
    res.status(200).send({
      message: 'User was deleted'
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Database error');
  }
});


export default userRouter;