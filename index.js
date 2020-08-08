const express = require('express')
const bodyParser = require('body-parser')
require('dotenv').config()
const bot = require('./bot.js') 

const TOKEN_BOT = process.env.TOKEN_BOT
const BASE_URI = `https://api.telegram.org/bot${TOKEN_BOT}`
const URL = 'http://newsapi.org/v2/top-headlines?country=id&'+'apiKey='+process.env.NEWS_API_TOKEN

let app = express()
app.use(bodyParser.json())

app.post('/',(req,res)=>{
    let body = req.body
    bot.extractMessage(body)
    res.send(body);
})
app.get('/',(req,res)=>{
    res.send(URL)
})

app.listen(3001)

