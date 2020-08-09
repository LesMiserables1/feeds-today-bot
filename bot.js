const axios = require('axios')
const room = require('./model/db.js')

const TOKEN_BOT = process.env.TOKEN_BOT
const BASE_URI = `https://api.telegram.org/bot${TOKEN_BOT}`

let extractMessage = async(body)=>{
    let regex_command = /\/(.+)/
    let command = body.message.text.match(regex_command)

    let chat_id = body.message.chat.id
    await room.addRoom({chat_id : chat_id,command : command[1]})
    if(command[1] == 'search'){

    }
    else if(command[1] == 'headlines'){


    }else if(command[1] == 'settopic'){

    }else if(command[1] == 'setlang'){

    }else if(command[1] == 'config'){
        configCommand({chat_id : chat_id})
        
    }else if(command[1] == 'donate'){

    }else if(command[1] == 'update'){

    }else if(command[1] == 'feedback'){

    }else if(command[1] == 'cancel'){

    }else if(command[1] == 'start'){
        let text = 
`Hi, i am <b>Feeds Today</b> bot.
I can feed you with today's headline all over the world so you don't feel left out.

Available commands:
/start - restart me
/headlines - feed yourself with latest headlines
/settopic - set news topic for this room
/setlang - set news language for this room
/config - list this room's configuration
/donate - support my owner
/update - log of my update
/feedback - send your valuable feedback to my owner
/cancel - cancel the current command

contact my owner through dev-story@gmail.com for anything you have in mind.

`
        sendMessage({chat_id : chat_id,text : text})
    }
}


let sendMessage = async(data)=>{
    try {
        await axios.post(BASE_URI+'/sendMessage',{
            chat_id : data.chat_id,
            text : data.text,
            parse_mode : 'HTML'
        })
    } catch (error) {
        console.log(error)
    }

}

let setCommands = async()=>{
    try {
        await axios.post(BASE_URI+'/setMyCommands',{
            commands : [
                {command : '/start', description : 'restart the bot'},
                {command : '/headlines', description: 'feed yourself with latest headlines'},
                {command : '/search', description : 'find anything you want'},
                {command : '/settopic', description : 'set topic for this room'},
                {command : '/setlang', description : 'set language for this room'},
                {command : '/config', description : "list this room's configuration"},
                {command : '/donate', description : 'support my nerd owner'},
                {command : '/nextupdate', description : "my owner's high expectaction of me"},
                {command : '/cancel', description : 'cancel the current command'}
            ]
        })   
    } catch (error) {
        console.log(error)
    }
}

let headlineCommand = async(data)=>{
    
}

let configCommand = async(data)=>{
    let lang = await room.getLang(data.chat_id)
    let topic = await room.getTopic(data.chat_id)
    
    let text = 
`This room configuration :

language : ${lang.lang}
topic : ${topic.topic}

you can change :
language by command /setlang
topic by command /setlang and /settopic

if you are lazy to set me up, i will send you news in english with universal topic
`
    sendMessage({chat_id : data.chat_id , text : text})
}   

let setLangCommand = async(data)=>{
    
}

let 
module.exports = {
    extractMessage : extractMessage,
    setCommands : setCommands
}