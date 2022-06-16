import express from 'express';
import {
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

export default router;
