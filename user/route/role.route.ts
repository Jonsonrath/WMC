import express, { type Request, type Response, type NextFunction} from 'express';

const rolerouter = express.Router();

rolerouter.use((req: Request, res: Response, next: NextFunction) => {
    console.log('Time:', Date.now());
    next();
});

rolerouter.get('/', (req: Request, res: Response) => {
  res.send('Role home page');
});

rolerouter.get('/about', (req: Request, res: Response) => {
  res.send('About Roles');
});

export default rolerouter;