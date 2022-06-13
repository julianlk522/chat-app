import db from "../config/db.js"

export const getMessages = (req, res) => {
    const sql = 'SELECT * FROM messages;'

    db.query(sql, (err, results) => {
        if (err) throw err
        console.log(results)
        res.status(200).json({message: 'successfully fetched messages'})
    })
}