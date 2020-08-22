const moongose = require('mongoose')
var assert = require('assert');

const dbUrl = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.qanws.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`

moongose.connect(dbUrl,{ useNewUrlParser: true,useUnifiedTopology: true })
moongose.set('useFindAndModify', false);

let roomSchema = new moongose.Schema({
    chat_id : Number,
    command : String,
    lang : {type : String, default : 'en'},
    topic : {type : String, default : 'general'}

})

const langSchema = new moongose.Schema({
    id : Number,
    lang : String
})
const topicSchema = new moongose.Schema({
    id : Number,
    topic : String
})

const Room = moongose.model('Room',roomSchema)
const Lang = moongose.model('Language',langSchema)
const Topic = moongose.model('Topic',topicSchema)

let updateRoom = async(data)=>{
    await Room.findOneAndUpdate({ chat_id : data.chat_id }, {$set : { command : data.command}},{
        upsert: true,
        setDefaultsOnInsert: true
    })
}

let changeRoomLang = async(data)=>{
    let lang = await Lang.findOne({id : data.id}).exec()
    await Room.findOneAndUpdate({chat_id : data.chat_id},{$set : {lang : lang.lang}})
}

let changeRoomTopic = async(data)=>{
    let topic = await Topic.findOne({id : data.id}).exec()
    await Room.findOneAndUpdate({chat_id : data.chat_id},{$set : {topic : topic.topic}})
}

let addLang = async(data)=>{
    Lang.create({lang : data.lang,id : data.id})
}

let addTopic = async(data)=>{
    Topic.create({topic : data.topic, id :data.id})
}

let getRoom = (data)=>{
    let room = Room.findOne({chat_id : data}).exec()
    return room
}

let getAllLang = ()=>{
    let lang = Lang.find({})
    return lang
}

let getAllTopic = ()=>{
    let topic = Topic.find({})
    return topic
}

module.exports = {
    updateRoom : updateRoom,
    addLang : addLang,
    addTopic : addTopic,
    changeRoomLang : changeRoomLang,
    changeRoomTopic : changeRoomTopic,
    getAllLang : getAllLang,
    getAllTopic : getAllTopic,
    getRoom : getRoom
} 