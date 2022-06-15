import db from "../config/db.js"
import asyncHandler from 'express-async-handler'

export const getUsers = (req, res) => {
    const sql = 'SELECT * FROM users;'

    db.query(sql, (err, results) => {
        if (err) throw err
        res.status(200).json(results)
    })
}

export const getUserContacts = (req, res) => {
    const sql = `SELECT name, user_id, messages.sender_id, messages.receiver_id, messages.content FROM users JOIN messages ON (user_id = messages.sender_id OR user_id = messages.receiver_id) WHERE user_id != ${req.params.userId} AND (messages.sender_id = ${req.params.userId} OR messages.receiver_id = ${req.params.userId});`

    db.query(sql, (err, results) => {
        if (err) throw err
        res.status(200).json(results)
    })
}

export const newUser = (req, res) => {
    const {name, username, password} = req.body

    // check if user exists
    db.query(`SELECT EXISTS (SELECT username FROM users WHERE username = \'${username}\');`, (err, results) => {
        if (err) throw err
        
        //  create user if not one already
        if (!Number(Object.values(results[0]))) {    
            const createUserSql = `INSERT INTO users (name, username, password) VALUES ('${name}', '${username}', '${password}');`

            return db.query(createUserSql, (err) => {
            
                //  return updated user list
                const selectSql = 'SELECT * FROM users;'

                db.query(selectSql, (err, results) => {
                    if (err) throw err
                    res.status(200).json(results)
                })

                if (err) throw err
            })
        } else {
            res.status(400).json({message: 'Error: user already exists with username provided'})
        }
    })
}

export const loginUser = (req, res) => {
    const {username, password} = req.body

    // check if user exists
    db.query(`SELECT EXISTS (SELECT username FROM users WHERE username = \'${username}\');`, (err, results) => {
        if (err) throw err
        
        //  if there is a user, check if the password matches
        if (Number(Object.values(results[0]))) {
            const passCheckSql = `SELECT EXISTS (SELECT username, password FROM users WHERE username = \'${username}\' AND password = \'${password}\');`

            db.query(passCheckSql, (err, results) => {
                if (err) throw err

                // if password matches, select and return user data
                if (Number(Object.values(results[0]))) {
                    const selectSql = `SELECT * FROM users WHERE username = \'${username}\' AND password = \'${password}\';`

                    db.query(selectSql, (err, results) => {
                        if (err) throw err
                        const {password, ...rest} = results[0]
                        res.status(200).json(rest)
                    })
                } else {
                    res.status(400).json({message: 'Error: invalid password provided'})
                }
            })
        } else {
            res.status(400).json({message: 'Error: no user found with login credentials provided'})
        }
    })
}