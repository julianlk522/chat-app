import mysql from 'mysql2'

//  mySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'mySqlRoot',
    database: 'chatapp'
})

export default db