import express, { type Express } from 'express';
import userRouter from './route/user.route.ts';
import roleRouter from './route/role.route.ts';
import { ApiError, errorHandler } from './errors.ts';

const app: Express = express();
const port = Number(process.env.PORT ?? 3000);

app.use(express.json());
app.use('/user', userRouter);
app.use('/role', roleRouter);
app.get('/', (_req, res) => {
  res.send('Hello World!');
});
app.use((_req, _res, next) => {
  next(new ApiError(404, 'NOT_FOUND', 'Route not found'));
});
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
