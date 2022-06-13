import db from "../config/db.js"

export const getUsers = (req, res) => {
    const sql = 'SELECT * FROM users;'

    db.query(sql, (err, results) => {
        if (err) throw err
        console.log(results)
        res.status(200).json({message: 'users fetched successfully'})
    })
}