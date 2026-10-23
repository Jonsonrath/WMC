import dbConnection from "./db.ts";
import type { RowDataPacket } from "mysql2";

export interface Role extends RowDataPacket {
    id: number;
    title: string;
}

const getAllRoles = () => {
    return dbConnection()
    .then(conn => {
        return conn.query<Role[]>('SELECT * FROM role')
        .then(res => conn.end().then(() => res));
    })
    .then(([rows, fields]) => rows)
    .catch(err => console.log(err));
};

const getRole = (id: number) => {
    return dbConnection()
    .then(conn => {
        return conn.query<Role[]>(
            'SELECT * FROM role WHERE id = ?', [id]
        )
        .then(res => conn.end().then(() => res));
    })
    .then(([rows, fields]) => rows[0])
    .catch(err => console.log(err));
};

export { getAllRoles, getRole };