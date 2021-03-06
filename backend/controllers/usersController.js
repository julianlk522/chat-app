import db from '../config/db.js'
import asyncHandler from 'express-async-handler'

export const getAllUsers = asyncHandler(async (req, res) => {
	const sql = 'SELECT * FROM users;'

	const userData = await db.query(sql)
	res.status(200).json(userData)
})

export const newUser = asyncHandler(async (req, res) => {
	const { name, username, password } = req.body

	if (!name || !username || !password) {
		res.status(400)
		throw new Error(
			'Did not receive all required data (missing name, username or password)'
		)
	}

	// check if user exists
	const userExists = await db.query(
		`SELECT EXISTS (SELECT username FROM users WHERE username = \'${username}\');`
	)

	//  create user if not one already
	if (!Object.values(userExists[0][0])[0]) {
		const createUserSql = `INSERT INTO users (name, username, password) VALUES ('${req.body.name}', '${username}', '${password}');`
		db.query(createUserSql)

		//  return new user data
		const selectSql = `SELECT * FROM users WHERE username = \'${username}\';`

		const newUserData = await db.query(selectSql)
		const { user_id, name, prefered_pic } = newUserData[0][0]
		res.status(200).json({ user_id, name, prefered_pic })

		//	error if trying to create a duplicate user
	} else {
		res.status(400)
		throw new Error('User already exists with username provided')
	}
})

export const loginUser = asyncHandler(async (req, res) => {
	const { username, password } = req.body

	if (!username || !password) {
		res.status(400).json({
			error: 'Did not receive all required data (missing username or password',
		})
		throw new Error(
			'Did not receive all required data (missing username or password).'
		)
	}

	// check if user exists
	const userExists = await db.query(
		`SELECT EXISTS (SELECT username FROM users WHERE username = \'${username}\');`
	)

	// if there is a user, check if the password matches
	if (Object.values(userExists[0][0])[0]) {
		const passCheckSql = `SELECT EXISTS (SELECT username, password FROM users WHERE username = \'${username}\' AND password = \'${password}\');`

		const passMatches = await db.query(passCheckSql)

		// if pass matches, return user data
		if (Object.values(passMatches[0][0])[0]) {
			const selectSql = `SELECT * FROM users WHERE username = \'${username}\' AND password = \'${password}\';`

			const userData = await db.query(selectSql)

			// remove username and password data
			const { user_id, name, prefered_pic } = userData[0][0]
			res.status(200).json({ user_id, name, prefered_pic })
		} else {
			res.status(400).json({ error: 'Invalid password provided.' })
			throw new Error('Invalid password provided: access denied.')
		}
	} else {
		res.status(400).json({
			error: 'No user found with login credentials provided',
		})
		throw new Error('No user found with login credentials provided.')
	}
})

export const getSortedUserContacts = asyncHandler(async (req, res) => {
	if (!req.params.userId) throw new Error('No user ID provided')

	const sql = `SELECT name, user_id, prefered_pic, last_active, messages.content, messages.created_at, messages.seen, messages.sender_id FROM users JOIN messages ON (user_id = messages.sender_id OR user_id = messages.receiver_id) WHERE user_id != ${req.params.userId} AND (messages.sender_id = ${req.params.userId} OR messages.receiver_id = ${req.params.userId}) GROUP BY name ORDER BY created_at DESC;`

	const contactsData = await db.query(sql)
	res.status(200).json(contactsData)
})

export const getUserNicknames = asyncHandler(async (req, res) => {
	if (!req.params.userId) {
		res.status(400).json({ error: 'No user ID provided' })
		throw new Error('No user ID provided')
	}

	const selectUserNicknamesSql = `SELECT * FROM nicknames
	WHERE assigner_id = ${req.params.userId};
	`
	const nicknamesResponse = await db.query(selectUserNicknamesSql)
	const nicknamesDataArray = nicknamesResponse[0]
	res.status(200).json(nicknamesDataArray)
})

export const assignNewNickname = asyncHandler(async (req, res) => {
	const { user_id, contact_id, nickname } = req.body

	if (!user_id || !contact_id || !nickname) {
		res.status(400).json({
			error: 'Did not receive all required data (missing userId, contactId or nickname to be set.',
		})
		throw new Error(
			'Did not receive all required data (missing userId, contactId or nickname to be set.'
		)
	}

	//	check whether the user has assigned the contact a nickname before

	const searchNicknamesSql = `SELECT * FROM nicknames WHERE assigner_id = ${user_id} AND contact_id = ${contact_id}`

	const nicknameSearchResponse = await db.query(searchNicknamesSql)

	//	if not an existing nickname, add one
	if (nicknameSearchResponse[0][0] === undefined) {
		const newNicknameSql = `INSERT INTO nicknames (assigner_id, contact_id, nickname) VALUES (${user_id}, ${contact_id}, '${nickname}');`

		db.query(newNicknameSql)
		console.log('new nickname')
		//	if existing nickname, overwrite it
	} else {
		const overWriteNicknameSql = `UPDATE nicknames SET nickname = '${nickname}' WHERE assigner_id = ${user_id} AND contact_id = ${contact_id}`

		db.query(overWriteNicknameSql)
		console.log('nickname overwritten')
	}

	//	return new nickname json
	const selectNewNicknameSql = `SELECT * FROM nicknames WHERE assigner_id = ${user_id} AND contact_id = ${contact_id};`

	const newNicknameResponse = await db.query(selectNewNicknameSql)
	const newNicknameResponseData = newNicknameResponse[0][0]

	res.status(200).json(newNicknameResponseData)
})

export const assignNewPreferedPic = asyncHandler(async (req, res) => {
	const { userId, preferedPic } = req.params

	if (!userId || !preferedPic) {
		res.status(400).json({ error: 'userId or preferedPic not provided' })
		throw new Error('userId or preferedPic not provided')
	}

	const updatePreferedPicSql = `UPDATE users SET prefered_pic = ${preferedPic} WHERE user_id = ${userId};`

	db.query(updatePreferedPicSql)

	res.status(200).json({ success: true })
})
