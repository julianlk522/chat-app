import express from 'express'
import { getUsers, newUser, loginUser } from '../controllers/usersController.js'
const router = express.Router()

router
    .route('/')
    .get(getUsers)
    .post(newUser)

router
    .route('/login')
    .post(loginUser)

export default router