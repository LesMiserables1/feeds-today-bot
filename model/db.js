const moongose = require('mongoose')
var assert = require('assert');

const dbUrl = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.qanws.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`

moongose.connect(dbUrl,{ useNewUrlParser: true,useUnifiedTopology: true })
moongose.set('useFindAndModify', false);

let roomSchema = new moongose.Schema({
    chat_id : Number,
    command : String,
    lang : {type : String, default : 'en'},
    topic : {type : String, default : 'universal'}

})

const langSchema = new moongose.Schema({
    lang : String
})
const topicSchema = new moongose.Schema({
    topic : String
})

const Room = moongose.model('Room',roomSchema)
const lang = moongose.model('Language',langSchema)
const topic = moongose.model('Topic',topicSchema)

let addRoom = async(data)=>{
    await Room.findOneAndUpdate({ chat_id : data.chat_id }, {$set : { command : data.command}},{
        upsert: true,
        setDefaultsOnInsert: true
    })
}
let changeRoomLang = ()=>{

}

let changeRoomTopic = ()=>{
    
}

let addLang = async(data)=>{
    lang.create({lang : data.lang})
}

let addTopic = async(data)=>{
    topic.create({topic : data.topic})
}

let getLang = async(data)=>{
    let lang = Room.findOne({chat_id : data}).exec()
    return lang
}

let getTopic = (data)=>{
    let topic = Room.findOne({chat_id : data}).exec()
    return topic
}


module.exports = {
    addRoom : addRoom,
    getTopic : getTopic,
    getLang : getLang,
    addLang : addLang,
    addTopic : addTopic,
    changeRoomLang : changeRoomLang,
    changeRoomTopic : changeRoomTopic
} 