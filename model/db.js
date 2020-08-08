const moongose = require('mongoose')

const dbUrl = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.qanws.mongodb.net/<dbname>?retryWrites=true&w=majority`

moongose.connect(dbUrl,{ useNewUrlParser: true,useUnifiedTopology: true })
const roomSchema = new moongose.Schema({
    chat_id : Number,
    topic : String
})

const room = moongose.model('room',roomSchema)

let addRoom = async(data)=>{
    await room.findOneAndUpdate({ chat_id : data.chat_id }, { topic : data.topic},{
        upsert: true
    })
}

module.exports = {
    addRoom : addRoom
}