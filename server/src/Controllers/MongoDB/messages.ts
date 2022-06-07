import config from '../../config'
import { Schema, connect, model } from 'mongoose'

const runMongoose = async () => {
	await connect(config.mongodb.path)
}

runMongoose().catch((err) => {
	console.log(err)
	throw new Error('error con mongoose')
})

const schema = new Schema({
	author: {
		id: { type: String, required: true },
		firstName: { type: String, required: true, max: 50 },
		lastName: { type: String, required: true, max: 50 },
		age: { type: Number, required: true },
		alias: { type: String, required: true, max: 20 },
		avatar: { type: String, required: true },
	},
	text: { type: String, required: true, max: 500 },
})

const msgModel = model('messages', schema)

const save = async (msg: any) => {
    const newMsg = new msgModel(msg)
    try{
        newMsg.save()
    }catch(err){
        console.log(err)
        throw new Error('Error')
    }
}

const get = async()=>{
    try{
        const msgs = await msgModel.find()
        return msgs
    }catch(err){
        console.log(err)
        throw new Error('Error')
    }
}

export {save, get}