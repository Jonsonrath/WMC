import mysql from 'mysql2/promise'


const dbConnection = () => {
    return mysql.createConnection({
        host: '127.0.0.1',
        port: 3306,
        user: 'root',
        password: 'secret',
        database: 'user-admin'
    })
}

export default dbConnection