import express from 'express'
import {getMessages, getUsersMessages, newMessage} from '../controllers/messagesController.js'
const router = express.Router()

router
    .route('/')
    .get(getMessages)
    .post(newMessage)

router
    .route('/:id')
    .get(getUsersMessages)

export default router