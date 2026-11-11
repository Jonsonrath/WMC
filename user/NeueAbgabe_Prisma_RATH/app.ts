import express, { type Express, type Request, type Response } from 'express';
import userRouter from './route/user.route.ts';
import roleRouter from './route/role.route.ts';
import { errorHandler } from './errors.ts';

const app: Express = express();
const port = Number(process.env.PORT ?? 3000);

app.use(express.json());

app.use('/users', userRouter);
app.use('/roles', roleRouter);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.use((req: Request, res: Response) => {
  res.status(404).send({ message: 'Route not found' });
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
