import express, { type Request, type Response, type NextFunction } from 'express';

const rolerouter = express.Router();

// middleware that is specific to this router
const timeLog = (req: Request, res: Response, next: NextFunction) => {
  console.log('Time: ', Date.now());
  next();
};
rolerouter.use(timeLog);

// define the home page route
rolerouter.get('/', (req: Request, res: Response) => {
  res.send('Role home page');
});
// define the about route
rolerouter.get('/about', (req: Request, res: Response) => {
  res.send('About Roles');
});

export default rolerouter;