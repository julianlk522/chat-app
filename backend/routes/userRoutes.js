import express from 'express'
import {
	getUsers,
	newUser,
	loginUser,
	getUserContacts,
} from '../controllers/usersController.js'
const router = express.Router()

router.route('/').get(getUsers).post(newUser)

router.route('/login').post(loginUser)

router.route('/:userId').get(getUserContacts)

export default router
