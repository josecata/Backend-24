import mongoose, { Collection, Model, ObjectId, Schema } from 'mongoose'
import config from '../../config'

const runMongoose = async () => {
	await mongoose.connect(config.mongodb.path)
}

runMongoose().catch((err) => {
	console.log(err)
	throw new Error('error con mongoose')
})

interface Product {
	id: number
	timestamp: number
	nombre: string
	descripcion: string
	codigo: string
	url: string
	precio: number
	stock: number
}
export default class Container {
	private collection: Model<Product>
	constructor(nameCollection: string, schema: Schema) {
		this.collection = mongoose.model(nameCollection, schema)
	}

	save = async (obj: object): Promise<Number> => {
		try {
			const products: Product[] = await this.getAll()
			const timestamp: number = Date.now()
			let newID: number
			if (products.length == 0) {
				newID = 1
			} else {
				newID = Number(products[products.length - 1].id) + 1
			}
			const newProduct = { id: newID, timestamp: timestamp, ...obj }
			const productToAdd = new this.collection(newProduct)
			await productToAdd.save()
			return newID
		} catch (err) {
			console.log(err)
			throw new Error('No se pudo guardar')
		}
	}

	getAll = async (): Promise<Product[]> => {
		try {
			return await this.collection.find()
		} catch (err) {
			console.log(err)
			throw new Error('Error returning all products')
		}
	}

	getById = async (id: number): Promise<any> => {
		try {
			return await this.collection.findOne({ id: id })
		} catch (err) {
			console.log(err)
			throw new Error('Error pidiendo los datos')
		}
	}

	modifyById = async (newValues: Product, id: number): Promise<boolean> => {
		try {
			const product = this.getById(id)
			if (product != undefined) {
				if (newValues.nombre != '') {
					await this.collection.updateOne(
						{ id: id },
						{
							$set: { nombre: newValues.nombre },
						}
					)
				}
				if (newValues.descripcion != '') {
					await this.collection.updateOne(
						{ id: id },
						{
							$set: { descripcion: newValues.descripcion },
						}
					)
				}
				if (newValues.url != '') {
					await this.collection.updateOne(
						{ id: id },
						{
							$set: { url: newValues.url },
						}
					)
				}
				if (newValues.precio != undefined) {
					await this.collection.updateOne(
						{ id: id },
						{
							$set: { precio: newValues.precio },
						}
					)
				}
				return true
			} else {
				return false
			}
		} catch (err) {
			console.log(err)
			throw new Error('Error pidiendo los datos')
		}
	}

	deleteById = async (id: number): Promise<boolean> => {
		try {
			const productToDelete = this.getById(id)
			if(productToDelete != undefined){
				await this.collection.deleteOne({id:id})
				return true
			}else{
				return false
			}
		} catch {
			throw new Error('Error al borrar el producto')
		}
	}

	deleteAll = async(): Promise<void> => {
		try {
			await this.collection.remove()
		} catch {
			throw new Error('Error borrando')
		}
	}
}
