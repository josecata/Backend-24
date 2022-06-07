import Cart from '../../Controllers/MongoDB/cart'
import { Schema } from 'mongoose'

const nameCollection = 'cart'

const schema: Schema = new Schema({
	id: { type: Number, required: true },
	timestamp: { type: Number},
	productos: { type: Array },
})

class DaoMongoCart extends Cart {
	constructor() {
		super(nameCollection, schema)
	}
}

export default DaoMongoCart
