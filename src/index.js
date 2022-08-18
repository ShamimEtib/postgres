const { response } = require('express');
const express = require('express')
const Pool = require('pg').Pool
const pool = new Pool({
    user: 'me',
    host:'localhost',
    database: 'api',
    password: 'password',
    port: 5432,
});

const port = process.env.PORT || 3000

const app = express()

app.use(express.json())

app.get('/users',(req, res) => {
    pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
        if (error) {
        throw error
        }
        res.status(200).send(results.rows)
    })
})

app.get('/users/:id', (req, res) => {
    const id = parseInt(req.params.id)
    
    pool.query('SELECT * FROM users WHERE id = $1', [id], (error, results) => {
        if (error) {
        throw error
        }
        res.status(200).send(results.rows)
    })
})

app.post('/users', (req, res) => {
    const {name, email} = req.body
    pool.query('INSERT INTO users (name, email) values ($1, $2) RETURNING *', [name, email], (error, results) => {
        if (error) {
            throw error
        }
        res.status(201).send(results.rows)
    })
})

app.put('/users/:id', (req, res) => {
    const id = parseInt(req.params.id)
    const {name, email} = req.body
    pool.query('UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *', [name, email, id], (error, results) => {
        if (error) {
            throw error
        }
        res.status(200).send(results.rows)
    })
})

app.delete('/users/:id', (req, res) => {
    const id = parseInt(req.params.id)
    
    pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
        if (error) {
        throw error
        }
        res.status(200).send(`Deleted user id ${id}`)
    })
})

app.listen(port, () => {
    console.log(`Server is listening on ${port}`)
})