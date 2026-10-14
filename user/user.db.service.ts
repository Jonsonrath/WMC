
import type { Role } from "./role.service.ts";
import dbConnection from "./db.ts";
import type { RowDataPacket, ResultSetHeader } from "mysql2";

interface User extends RowDataPacket {
    id?: string;
    name: string;
    roleId: number;
    role?: Role;
}

const getAllUsers = () => {
    return dbConnection()
    .then(conn => {
        return conn.query<User[]>('SELECT * FROM user')
        .then(res => conn.end().then(() => res));
    })
    .then(([rows, fields]) => rows)
    .catch(err => console.log(err));
};

const getUser = (id: string) => {
    return dbConnection()
    .then(conn => {
        return conn.query<User[]>(
            'SELECT * FROM user WHERE id = ?', [id]
        )
        .then(res => conn.end().then(() => res));
    })
    .then(([rows, fields]) => rows[0])
    .catch(err => console.log(err));
};

const createUser = (user: User) => {
    return dbConnection()
    .then(conn => {
        return conn.query<ResultSetHeader>(
            'INSERT INTO user (name, roleId) VALUES (?, ?)',
            [user.name, user.roleId]
        )
        .then(res => conn.end().then(() => res));
    })
    .then(([rows, fields]) => rows)
    .catch(err => console.log(err));
};

const updateUser = (user: User) => {
    return dbConnection()
    .then(conn => {
        return conn.query<ResultSetHeader>(
            'UPDATE user SET name = ?, roleId = ? WHERE id = ?',
            [user.name, user.roleId, user.id]
        )
        .then(res => conn.end().then(() => res));
    })
    .then(([rows, fields]) => rows)
    .catch(err => console.log(err));
};

const deleteUser = (id: string) => {
    return dbConnection()
    .then(conn => {
        return conn.query<ResultSetHeader>(
            'DELETE FROM user WHERE id = ?', [id]
        )
        .then(res => conn.end().then(() => res));
    })
    .then(([rows, fields]) => rows)
    .catch(err => console.log(err));
};

export { getAllUsers, getUser, createUser, updateUser, deleteUser };
