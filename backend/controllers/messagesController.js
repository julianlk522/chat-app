import db from '../config/db.js';

export const getMessages = (req, res) => {
  const sql = 'SELECT * FROM messages;';

  db.query(sql, (err, results) => {
    if (err) throw err;
    res.status(200).json(results);
  });
};

export const getUserMessages = (req, res) => {
  const userId = req.params.userId;

  const sql = `SELECT * FROM messages WHERE sender_id = ${userId} OR receiver_id = ${userId};`;

  db.query(sql, (err, results) => {
    if (err) throw err;
    res.status(200).json(results);
  });
};

export const getMostRecentMessagesFromContacts = (req, res) => {
  const sql = `SELECT users.name, sender_id, receiver_id, content, created_at FROM (SELECT users.name, message_id, sender_id, receiver_id, content, created_at FROM messages JOIN users ON (users.user_id = sender_id OR users.user_id = receiver_id) WHERE users.user_id != ${req.params.userId} AND (sender_id = ${req.params.userId} OR receiver_id = ${req.params.userId}) GROUP BY users.name) as user_contacts_select JOIN users ON (users.user_id = sender_id OR users.user_id = receiver_id) WHERE users.user_id != ${req.params.userId} ORDER BY created_at;`;

  db.query(sql, (err, results) => {
    if (err) throw err;
    res.status(200).json(results);
  });
};

export const newMessage = (req, res) => {
  const { senderId, receiverId, content } = req.body;

  const updateSql = `INSERT INTO messages (sender_id, receiver_id, content) VALUES ('${senderId}', '${receiverId}', '${content}');`;

  db.query(updateSql, err => {
    if (err) throw err;
    const selectUpdatedUserMessagesSql = `SELECT * FROM messages WHERE sender_id = ${senderId} OR receiver_id = ${senderId};`;

    db.query(selectUpdatedUserMessagesSql, (err, results) => {
      if (err) throw err;
      res.status(200).json(results);
    });
  });
};

export const deleteMessage = (req, res) => {
  const { userId, messageId } = req.body;
  const deleteSql = `DELETE FROM messages WHERE message_id = ${messageId};`;

  console.log(deleteSql);

  db.query(deleteSql, err => {
    if (err) throw err;
    const selectUpdatedUserMessagesSql = `SELECT * FROM messages WHERE sender_id = ${userId} OR receiver_id = ${userId};`;

    db.query(selectUpdatedUserMessagesSql, (err, results) => {
      if (err) throw err;
      res.status(200).json(results);
    });
  });
};

export const deleteMultipleMessages = (req, res) => {
  const { userId, messageIdsString } = req.body;

  if (!messageIdsString || !userId) {
    throw new Error('userId or messageIdsString not provided');
  }

  // split ids into array to be looped over
  const messageIdsArray = messageIdsString.split(',');

  //  base sql using ids array
  let deleteMultipleSql = `DELETE FROM messages WHERE message_id = ${messageIdsArray[0]}`;

  //  add OR clauses for each additional message to be deleted
  for (let n = messageIdsArray.length - 1; n > 0; n--) {
    deleteMultipleSql =
      deleteMultipleSql + ` OR message_id = ${messageIdsArray[n]}`;
  }

  deleteMultipleSql = deleteMultipleSql + ';';

  db.query(deleteMultipleSql, err => {
    if (err) throw err;
    const selectUpdatedUserMessagesSql = `SELECT * FROM messages WHERE sender_id = ${userId} OR receiver_id = ${userId};`;

    db.query(selectUpdatedUserMessagesSql, (err, results) => {
      if (err) throw err;
      console.log('deleteMultipleSql ultimately became: ', deleteMultipleSql);
      res.status(200).json(results);
    });
  });
};
