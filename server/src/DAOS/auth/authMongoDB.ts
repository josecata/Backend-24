import Auth from '../../Controllers/MongoDB/auth'
import { Schema } from 'mongoose'

const nameCollection = 'users'

const schema: Schema = new Schema({
	user: { type: String, required: true },
	password: { type: String, required:true},
})

class DaoAuth extends Auth {
	constructor() {
		super(nameCollection, schema)
	}
}

export default DaoAuth
