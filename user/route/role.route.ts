import express, { type Request, type Response, type NextFunction } from 'express';
import { getAllRoles, getRole } from '../db services/role.db.service.ts';

const rolerouter = express.Router();

rolerouter.use((req: Request, res: Response, next: NextFunction) => {
    console.log('Time:', Date.now());
    next();
});

rolerouter.get('/', (req: Request, res: Response) => {
    getAllRoles()
    .then(roles => {
        res.send(roles);
    })
    .catch(err => {
        console.log(err);
        res.status(500).send('Database error');
    });
});

rolerouter.get('/:id', (req: Request, res: Response) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id < 1) {
        return res.status(400).send('Invalid role ID');
    }

    getRole(id)
    .then(role => {
        if (!role) {
            return res.status(404).send('ROLE NOT FOUND');
        }
        res.status(200).json(role);
    })
    .catch(err => {
        console.log(err);
        res.status(500).send('Database error');
    });
});

export default rolerouter;
