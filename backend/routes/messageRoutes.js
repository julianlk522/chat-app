import express from 'express';
import {
  deleteMessage,
  getMessages,
  getMostRecentMessagesFromContacts,
  getUserMessages,
  newMessage,
} from '../controllers/messagesController.js';
const router = express.Router();

router.route('/').get(getMessages).post(newMessage);

router
  .route('/:userId')
  .get(getUserMessages)
  .post(getMostRecentMessagesFromContacts);

router.route('/delete').delete(deleteMessage);

export default router;
