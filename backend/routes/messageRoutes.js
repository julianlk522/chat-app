import express from 'express'
import {
	deleteMessage,
	deleteMultipleMessages,
	getAllMessages,
	getUserMessages,
	newMessage,
	readContactMessages,
} from '../controllers/messagesController.js'
const router = express.Router()

router
	.route('/')
	.get(getAllMessages)
	.post(newMessage)
	.patch(readContactMessages)

router.route('/:userId').get(getUserMessages)

router.route('/delete').delete(deleteMessage)
router.route('/delete/multiple').delete(deleteMultipleMessages)

export default router
