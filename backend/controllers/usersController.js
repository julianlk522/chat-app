import db from '../config/db.js'
import asyncHandler from 'express-async-handler'

export const getUsers = asyncHandler(async (req, res) => {
	const sql = 'SELECT * FROM users;'

	db.query(sql, (err, results) => {
		if (err) throw err
		res.status(200).json(results)
	})
})

export const getUserContacts = asyncHandler(async (req, res) => {
	const sql = `SELECT name, user_id, prefered_pic FROM users JOIN messages ON (user_id = messages.sender_id OR user_id = messages.receiver_id) WHERE user_id != ${req.params.userId} AND (messages.sender_id = ${req.params.userId} OR messages.receiver_id = ${req.params.userId}) GROUP BY name;`

	db.query(sql, (err, results) => {
		if (err) throw err
		res.status(200).json(results)
	})
})

export const newUser = asyncHandler(async (req, res) => {
	const { name, username, password } = req.body

	// check if user exists
	db.query(
		`SELECT EXISTS (SELECT username FROM users WHERE username = \'${username}\');`,
		(err, results) => {
			if (err) throw err

			//  create user if not one already
			if (!Number(Object.values(results[0]))) {
				const createUserSql = `INSERT INTO users (name, username, password) VALUES ('${name}', '${username}', '${password}');`

				return db.query(createUserSql, (err) => {
					if (err) throw err
					//  return logged-in user data
					const selectSql = `SELECT * FROM users WHERE username = \'${username}\';`

					db.query(selectSql, (err, results) => {
						if (err) throw err
						const { password, ...rest } = results[0]
						res.status(200).json(rest)
					})
				})
			} else {
				res.status(400).json({
					message:
						'Error: user already exists with username provided',
				})
			}
		}
	)
})

export const loginUser = asyncHandler(async (req, res) => {
	const { username, password } = req.body

	if (!username || !password) {
		res.status(400)
		throw new Error(
			'Did not receive all required data (missing username or password)'
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
			res.status(400)
			throw new Error('Invalid password provided: access denied.')
		}
	} else {
		res.status(400)
		throw new Error('No user found with login credentials provided')
	}
})
