import express from 'express'
import {
	getUsers,
	newUser,
	loginUser,
	getSortedUserContacts,
	assignNewNickname,
	getUserNicknames,
	assignNewPreferedPic,
} from '../controllers/usersController.js'
const router = express.Router()

router.route('/').get(getUsers).post(newUser)

router.route('/login').post(loginUser)

router.route('/:userId').get(getSortedUserContacts)

router.route('/:userId/nicknames').get(getUserNicknames)

router.route('/new-nickname').post(assignNewNickname)

router.route('/:userId/prefered-pic/:preferedPic').post(assignNewPreferedPic)

export default router
