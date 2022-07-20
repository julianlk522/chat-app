import express from 'express'
import {
	getUsers,
	newUser,
	loginUser,
	getUserContacts,
	assignNewNickname,
} from '../controllers/usersController.js'
const router = express.Router()

router.route('/').get(getUsers).post(newUser)

router.route('/login').post(loginUser)

router.route('/:userId').get(getUserContacts)

router.route('/new-nickname').post(assignNewNickname)

export default router
