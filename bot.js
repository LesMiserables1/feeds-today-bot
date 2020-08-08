const axios = require('axios')
const room = require('./model/db.js')

const url = 'mongodb+srv://devstory:<password>@cluster0.qanws.mongodb.net/<dbname>?retryWrites=true&w=majority'

let extractMessage = (body)=>{
    let regex_command = /\/(.+) (.+)/
    let command = body.message.text.match(regex_command)

    if(command[1] == 'topic'){
        room.addRoom({chat_id : body.message.chat.id,topic : command[2]})
    }
}

module.exports = {
    extractMessage : extractMessage
}