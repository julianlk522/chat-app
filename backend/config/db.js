import mysql from 'mysql2/promise'

//  mySQL connection
const db = await mysql.createConnection({
	host: process.env.mySqlHost,
	user: process.env.mySqlUser,
	password: process.env.mySqlPassword,
	database: process.env.mySqlDatabase,
})

export default db
