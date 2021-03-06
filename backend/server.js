import express from 'express'
import { errorHandler } from './middleware/errorMiddleware.js'
import cors from 'cors'
import db from './config/db.js'

const app = express()
const PORT = process.env.PORT

//  connect to MySQL db
db.connect((err) => {
	if (err) {
		console.log(err)
		console.log(process.env.mySqlPassword)
		return
	}

	console.log('connected to mySQL db')
})

//  middleware
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())
app.use(errorHandler)

//  routes
import userRoutes from './routes/userRoutes.js'
app.use('/users', userRoutes)

import messageRoutes from './routes/messageRoutes.js'
app.use('/messages', messageRoutes)

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
