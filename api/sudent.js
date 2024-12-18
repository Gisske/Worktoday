const express = require('express')
const router = express.Router()

router.get('/list', (req,res) =>{
    let db = req.db
    console.log('list')
    let row = db('student')
    console.log(row)
    res.send({
        status:'ok',
        row : row
    })
})