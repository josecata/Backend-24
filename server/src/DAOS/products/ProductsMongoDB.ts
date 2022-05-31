import Container from '../../Controllers/MongoDB/products'
import { Schema } from 'mongoose'

const nameCollection = 'product'

const schema: Schema = new Schema({
	id: { type: Number, required: true },
	timestamps: { type: Number},
	nombre: { type: String, required: true },
	descripcion: { type: String, required: true },
	codigo: { type: String, required: true },
	url: { type: String, required: true },
	precio: { type: Number, required: true },
	stock: { type: Number},
})

class DaoMongoProduct extends Container {
	constructor() {
		super(nameCollection, schema)
	}
}

export default DaoMongoProduct
