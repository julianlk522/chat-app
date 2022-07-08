import db from '../config/db.js'
import asyncHandler from 'express-async-handler'

export const getMessages = asyncHandler(async (req, res) => {
	const sql = 'SELECT * FROM messages;'

	const messageData = await db.query(sql)

	res.status(200).json(messageData)
})

export const getUserMessages = asyncHandler(async (req, res) => {
	const userId = req.params.userId
	if (!userId) {
		res.status(400)
		throw new Error('No user ID provided')
	}

	// check if user exists
	const userExists = await db.query(
		`SELECT EXISTS (SELECT user_id FROM users WHERE user_id = \'${userId}\');`
	)

	if (Object.values(userExists[0][0])[0]) {
		const sql = `SELECT * FROM messages WHERE sender_id = ${userId} OR receiver_id = ${userId};`

		const userMessageData = await db.query(sql)
		res.status(200).json(userMessageData)

		//	error if trying to search for a nonexistent user's messages
	} else {
		res.status(400)
		throw new Error('No user found with ID provided')
	}
})

export const getMostRecentMessagesFromContacts = asyncHandler(
	async (req, res) => {
		if (!req.params.userId) {
			res.status(400)
			throw new Error('No user ID provided')
		}
		// check if user exists
		const userExists = await db.query(
			`SELECT EXISTS (SELECT user_id FROM users WHERE user_id = \'${req.params.userId}\');`
		)

		if (Object.values(userExists[0][0])[0]) {
			const sql = `SELECT users.name, sender_id, receiver_id, content, seen, created_at FROM (SELECT users.name, message_id, sender_id, receiver_id, content, seen, created_at FROM messages JOIN users ON (users.user_id = sender_id OR users.user_id = receiver_id) WHERE users.user_id != ${req.params.userId} AND (sender_id = ${req.params.userId} OR receiver_id = ${req.params.userId}) GROUP BY users.name) as user_contacts_select JOIN users ON (users.user_id = sender_id OR users.user_id = receiver_id) WHERE users.user_id != ${req.params.userId} ORDER BY created_at;`

			const recentMessageData = await db.query(sql)
			res.status(200).json(recentMessageData)
		} else {
			res.status(400)
			throw new Error('No user found with ID provided')
		}
	}
)

export const readContactMessages = asyncHandler(async (req, res) => {
	const { userId, contactId } = req.body

	if (!userId || !contactId) {
		res.status(400)
		throw new Error('userId or contactId not provided')
	}

	// check if user and contact both exist
	const userExists = await db.query(
		`SELECT EXISTS (SELECT user_id FROM users WHERE user_id = \'${userId}\');`
	)

	const contactExists = await db.query(
		`SELECT EXISTS (SELECT user_id FROM users WHERE user_id = \'${contactId}\');`
	)

	// if they both exist, set contact's messages to read
	if (
		Object.values(userExists[0][0])[0] &&
		Object.values(contactExists[0][0])[0]
	) {
		const sql = `UPDATE messages SET seen = 1 WHERE sender_id = ${contactId} AND receiver_id = ${userId};`

		db.query(sql)
		res.status(200).json({ message: 'successfully updated seen' })
	} else {
		res.status(400)
		throw new Error('Either user or contact not found with IDs provided')
	}
})

export const newMessage = asyncHandler(async (req, res) => {
	const { senderId, receiverId, content } = req.body

	if (!senderId || !receiverId || !content) {
		res.status(400)
		throw new Error(
			'Required data not provided: senderId, receiverId or content not found'
		)
	}

	// check if sender and receiver both exist
	const senderExists = await db.query(
		`SELECT EXISTS (SELECT user_id FROM users WHERE user_id = \'${senderId}\');`
	)

	const receiverExists = await db.query(
		`SELECT EXISTS (SELECT user_id FROM users WHERE user_id = \'${receiverId}\');`
	)

	//	if they both exist, update messages and return the sender's new message data
	if (
		Object.values(senderExists[0][0])[0] &&
		Object.values(receiverExists[0][0])[0]
	) {
		const updateSql = `INSERT INTO messages (sender_id, receiver_id, content) VALUES ('${senderId}', '${receiverId}', '${content}');`

		db.query(updateSql)

		const selectUpdatedMessagesSql = `SELECT * FROM messages WHERE sender_id = ${senderId} OR receiver_id = ${senderId};`

		const updatedMessageData = await db.query(selectUpdatedMessagesSql)
		res.status(200).json(updatedMessageData)
	}
})

export const deleteMessage = asyncHandler(async (req, res) => {
	const { userId, messageId } = req.body

	if (!userId || !messageId) {
		res.status(400)
		throw new Error('Required data not provided: userId or messageId found')
	}

	const deleteSql = `DELETE FROM messages WHERE message_id = ${messageId};`

	db.query(deleteSql)

	// return updated messages
	const selectUpdatedMessagesSql = `SELECT * FROM messages WHERE sender_id = ${userId} OR receiver_id = ${userId};`

	const updatedMessageData = await db.query(selectUpdatedMessagesSql)
	res.status(200).json(updatedMessageData)
})

export const deleteMultipleMessages = asyncHandler(async (req, res) => {
	const { userId, messageIdsString } = req.body

	if (!messageIdsString || !userId) {
		res.status(400)
		throw new Error('userId or messageIdsString not provided')
	}

	// split ids into array to be looped over
	const messageIdsArray = messageIdsString.split(',')

	//  base sql using ids array
	let deleteMultipleSql = `DELETE FROM messages WHERE message_id = ${messageIdsArray[0]}`

	//  add OR clauses for each additional message to be deleted
	for (let n = messageIdsArray.length - 1; n > 0; n--) {
		deleteMultipleSql =
			deleteMultipleSql + ` OR message_id = ${messageIdsArray[n]}`
	}

	deleteMultipleSql = deleteMultipleSql + ';'

	db.query(deleteMultipleSql)

	//	return updated messages
	const selectUpdatedMessagesSql = `SELECT * FROM messages WHERE sender_id = ${userId} OR receiver_id = ${userId};`

	const updatedMessageData = await db.query(selectUpdatedMessagesSql)
	res.status(200).json(updatedMessageData)
})
