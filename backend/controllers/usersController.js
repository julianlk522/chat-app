import db from "../config/db.js"

export const getUsers = (req, res) => {
    const sql = 'SELECT * FROM users;'

    db.query(sql, (err, results) => {
        if (err) throw err
        res.status(200).json(results)
    })
}