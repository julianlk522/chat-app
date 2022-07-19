import * as dotenv from 'dotenv'
import mysql from 'mysql2/promise'

dotenv.config({ debug: true })

//  mySQL connection
const db = await mysql.createConnection({
	host: process.env.mySqlHost,
	user: process.env.mySqlUser,
	password: process.env.mySqlPassword,
	database: process.env.mySqlDatabase,
})

export default db
