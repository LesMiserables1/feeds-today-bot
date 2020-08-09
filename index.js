const express = require('express')
const bodyParser = require('body-parser')
require('dotenv').config()
const bot = require('./bot.js') 

const TOKEN_BOT = process.env.TOKEN_BOT
const BASE_URI = `https://api.telegram.org/bot${TOKEN_BOT}`

let app = express()
app.use(bodyParser.json())

app.post('/',(req,res)=>{
    let body = req.body
    bot.extractMessage(body)
    res.send(body);
})
app.get('/',(req,res)=>{
    bot.setCommands()
    res.send('URL')
})

app.listen(3001)

