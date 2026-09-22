import express, { type Express, type Request, type Response } from 'express';
import userrouter from './user.route.ts';
import rolerouter from './role.route.ts';
import { timeLog } from 'console';

const app: Express = express();

app.use('/user', userrouter);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

userrouter.use(timeLog)
userrouter.get('/', (req: Request, res:Response) => {
  res.send('User home page')
})

app.listen(3000);



