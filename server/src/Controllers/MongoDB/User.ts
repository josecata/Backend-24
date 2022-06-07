import mongoose from 'mongoose'

const user = new mongoose.Schema({
	user: { type: String, unique: true },
	password: { type: String },
	isAdmin: { type: Boolean, default: false },
})

export default mongoose.model('user', user)
