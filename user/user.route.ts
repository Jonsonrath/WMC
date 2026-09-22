import express, { type Request, type Response, type NextFunction } from 'express';

const userrouter = express.Router();

// middleware that is specific to this router
const timeLog = (req: Request, res: Response, next: NextFunction) => {
  console.log('Time: ', Date.now());
  next();
};
userrouter.use(timeLog);

// define the home page route
userrouter.get('/', (req: Request, res: Response) => {
  res.send('User home page');
});
// define the about route
userrouter.get('/about', (req: Request, res: Response) => {
  res.send('About users');
});

export default userrouter;