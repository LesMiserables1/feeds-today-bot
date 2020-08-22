const axios = require('axios')
const room = require('../model/db.js')
const news = require('./news.js')
const FormData = require('form-data')
const fs = require('fs')
const { text } = require('body-parser')
const TOKEN_BOT = process.env.TOKEN_BOT
const BASE_URI = `https://api.telegram.org/bot${TOKEN_BOT}`

let extractMessage = async (body) => {
    let regex_command = /\/(.+)/
    let command = body.message.text.match(regex_command)
    let chat_id = body.message.chat.id
    try {
        room.updateRoom({ chat_id: chat_id, command: command[1] })
        if (command[1] == 'search') {
            setQueryCommand({ chat_id: chat_id })
        }
        else if (command[1] == 'headlines') {
            headlineCommand({ chat_id: chat_id })

        } else if (command[1] == 'settopic') {
            setTopicCommand({ chat_id: chat_id })
        } else if (command[1] == 'setlang') {
            setLangCommand({ chat_id: chat_id })
        } else if (command[1] == 'config') {
            configCommand({ chat_id: chat_id })

        } else if (command[1] == 'donate') {
            let text = 
            `are you find me useful? feel free to donate my owner

1. Flip : https://flip.id/$VSQTH
2. Bank Account BCA: 8190365833 (a.n Andre)
3. Dana : https://link.dana.id/qr/s119i5v
`
            await sendMessage({chat_id : chat_id,text : text})
            await sendPhoto({chat_id : chat_id})
            sendMessage({chat_id : chat_id,text : 'thank you for supporting my owner'})
            setCommandCancel({chat_id : chat_id})
            
        } else if (command[1] == 'feedback') {
            let text = 
            `if you feel i am not good enough, feel free to send my owner your feedback to developer.story4@gmail.com`
            sendMessage({chat_id : chat_id,text : text})
            setCommandCancel({chat_id : chat_id})
        } else if (command[1] == 'cancel') {
            let text =
            `the command has been cancelled`
            sendMessage({chat_id:chat_id,text:text})
        } else if (command[1] == 'start') {
            let text =
                `hi, i am <b>Feeds Today</b> bot.
i can feed you with today's headline all over the world so you don't feel left out.

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

contact my owner through developer.story4@gmail.com for anything you have in mind.

`
            sendMessage({ chat_id: chat_id, text: text })
        } else {
            sendMessage({ chat_id: chat_id, text: 'command is invalid. say what ?' })
        }
    } catch (error) {
        proceedMessage({ chat_id: chat_id, msg: body.message.text })
    }
}


let sendMessage = async (data) => {
    try {
        await axios.post(BASE_URI + '/sendMessage', {
            chat_id: data.chat_id,
            text: data.text,
            parse_mode: 'HTML',
            disable_web_page_preview: true
        })
    } catch (error) {
        console.log(error)
    }

}
let sendPhoto = async (data)=>{
    let caption = 
    `4. Gopay
this is my Gopay qr code, you can scan it or upload it to donate by gopay
    `
    const form = new FormData()
    form.append('chat_id', data.chat_id)
    form.append('photo',fs.createReadStream('img/gopay.png'))
    form.append('caption',caption)
    try {
        await axios.post(BASE_URI+'/sendPhoto',form,{headers : form.getHeaders()})
    } catch (error) {
        
    }
}
let setCommandCancel = async (data)=>{
    await room.updateRoom({ chat_id: data.chat_id, command: 'cancel' })
}
let setCommands = async () => {
    try {
        await axios.post(BASE_URI + '/setMyCommands', {
            commands: [
                { command: '/start', description: 'restart the bot' },
                { command: '/headlines', description: 'feed yourself with latest headlines' },
                { command: '/search', description: 'find anything you want' },
                { command: '/settopic', description: 'set topic for this room' },
                { command: '/setlang', description: 'set language for this room' },
                { command: '/config', description: "list this room's configuration" },
                { command: '/donate', description: 'support my nerd owner' },
                { command: '/feedback', description: 'send your valuable feedback to my owner' },
                { command: '/cancel', description: 'cancel the current command' }
            ]
        })
    } catch (error) {
        console.log(error)
    }
}

let setQueryCommand = async (data) => {
    let text = `what do you want to search?`
    sendMessage({ chat_id: data.chat_id, text: text })
}

let headlineCommand = async (data) => {
    let roomChat = await room.getRoom(data.chat_id)
    let resp = await news.headlineAPI({ lang: roomChat.lang, topic: roomChat.topic })
    if(resp.data.totalResults == 0){
        sendMessage({ chat_id: data.chat_id, text: `i can't find anything right now` })
    }else {
        for (let i = 0; i < Math.min(7,resp.data.totalResults); ++i) {
            let text =
                `<b>${resp.data.articles[i].title}</b>
${resp.data.articles[i].description}
${resp.data.articles[i].url}    
    `
            sendMessage({ chat_id: data.chat_id, text: text })
        }
        setCommandCancel({chat_id : data.chat_id})
    }

}

let configCommand = async (data) => {
    let roomChat = await room.getRoom(data.chat_id)

    let text =
        `this room configuration :

language : ${roomChat.lang}
topic : ${roomChat.topic}

you can change :
language by command /setlang
topic by command /settopic

if you are lazy to set me up, i will send you the headline news in english with general topic
`
    sendMessage({ chat_id: data.chat_id, text: text })
}

let setLangCommand = async (data) => {
    let lang = await room.getAllLang()
    let str = ``
    lang.forEach(el => {
        str += `${el.id}. ${el.lang}\n`
    });
    let text =
        `i support these languages :

${str}
what language do you want to set up for this room ?
choose by replying its number
`
    sendMessage({ chat_id: data.chat_id, text: text })
}

let setTopicCommand = async (data) => {
    let topic = await room.getAllTopic()
    let str = ``

    topic.forEach(el => {
        str += `${el.id}. ${el.topic}\n`
    });
    let text =
        `i cover these topics :

${str}
what topic do you want to set up for this room ?
choose by replying its number
`
    sendMessage({ chat_id: data.chat_id, text: text })
}

let proceedMessage = async (data) => {
    let roomChat = await room.getRoom(data.chat_id)
    let msg = data.msg
    let command = roomChat.command

    try {
        if (command == 'search') {
            let resp = await news.searchAPI({query:msg})
            for (let i = 0; i <  Math.min(7,resp.data.totalResults); ++i) {
                let text =
                    `<b>${resp.data.articles[i].title}</b>
${resp.data.articles[i].description}
${resp.data.articles[i].url}    
                `
                sendMessage({ chat_id: data.chat_id, text: text })
            }
            setCommandCancel({chat_id : data.chat_id})
        }
        else if (command == 'headlines') {


        } else if (command == 'settopic') {

            await room.changeRoomTopic({ chat_id: data.chat_id, id: msg })
            let text = `topic has been set up`
            sendMessage({ chat_id: data.chat_id, text: text })
            setCommandCancel({chat_id : data.chat_id})

        } else if (command == 'setlang') {

            await room.changeRoomLang({ chat_id: data.chat_id, id: msg })
            let text = `language has been set up`
            sendMessage({ chat_id: data.chat_id, text: text })
            setCommandCancel({chat_id : data.chat_id})

        } else if (command == 'config') {

        } else if (command == 'donate') {

        } else if (command == 'feedback') {

        } else if (command == 'cancel') {

        } else if (command == 'start') {

        } else {
        }
    } catch (error) {
        // proceedMessage({ chat_id: data.chat_id, msg: msg })
        console.log(error)
    }

}


module.exports = {
    extractMessage: extractMessage,
    setCommands: setCommands
}

