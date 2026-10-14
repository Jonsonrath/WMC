import express, { type Request, type Response, type NextFunction} from 'express';
import {getAllUsers, createUser, deleteUser, updateUser, getUser, exists} from '../db services/user.db.service.ts';
//import { createUser, deleteUser, updateUser } from './user.service.ts';

const userRouter = express.Router();


userRouter.use((req: Request, res: Response, next: NextFunction) => {
    console.log('Time:', Date.now());
    next();
});



userRouter.get('/', (req: Request, res: Response) => {
//  const users = getAllUsers();

//  res.status(200).json(users);

  getAllUsers()
  .then(users => {
    res.send(users);
  })

});


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

  const user = req.body;

  createUser(user).then(response => {
    res.send(response);
  });

});

userRouter.put('/update/:id', (req: Request, res: Response) => {
    const id = req.params.id as string;
    const updatedUser = req.body;

    getUser(id).then(user => {
        if (!user) {
            return res.status(404).send("USER NOT FOUND");
        }

        Object.assign(user, updatedUser);

        updateUser(user).then(() => {
            res.status(200).json(user);
        });
    });
});


userRouter.delete('/delete/:id', (req: Request, res: Response) => {
  const id = req.params.id as string;
  
  if(!exists(id)){
    res.status(404).send("User not found")
  }

  deleteUser(id);

  res.status(200).send({
    message: 'User was deleted'
  });
});


export default userRouter;