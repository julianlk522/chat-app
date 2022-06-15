import db from "../config/db.js"

export const getMessages = (req, res) => {
    const sql = 'SELECT * FROM messages;'

    db.query(sql, (err, results) => {
        if (err) throw err
        res.status(200).json(results)
    })
}

export const getUsersMessages = (req, res) => {
    const userId = req.params.userId
    
    const sql = `SELECT * FROM messages WHERE sender_id = ${userId} OR receiver_id = ${userId};`

    db.query(sql, (err, results) => {
        if (err) throw err
        res.status(200).json(results)
    })
}

export const newMessage = (req, res) => {
    const {senderId, receiverId, content} = req.body
    
    const updateSql = `INSERT INTO messages (sender_id, receiver_id, content) VALUES ('${senderId}', '${receiverId}', '${content}');`

    db.query(updateSql, (err) => {
        const selectSql = 'SELECT * FROM messages;'

        db.query(selectSql, (err, results) => {
            if (err) throw err
            res.status(200).json(results)
        })

        if (err) throw err
    })
}