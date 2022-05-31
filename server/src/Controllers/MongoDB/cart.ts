import mongoose, { Model, ObjectId, Schema } from 'mongoose'
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

interface Carrito {
	_id?: ObjectId
	id: number
	timestamp: number
	productos: Product[]
}

export default class Cart {
	private collection: Model<Carrito>
	constructor(nameCollection: string, schema: Schema<Carrito>) {
		this.collection = mongoose.model(nameCollection, schema)
	}
	create = async (): Promise<number> => {
		try {
			const carts = await this.getAllCart()
			let newID: number
			if (carts.length == 0) {
				newID = 1
			} else {
				newID = Number(carts[carts.length - 1].id) + 1
			}
			const timestamp: number = Date.now()
			const newCart = { id: newID, timestamp: timestamp, productos: [] }
			const cart = new this.collection(newCart)
			const saveCart = await cart.save()
			return newID
		} catch (err) {
			console.log(err)
			throw new Error('No se pudo crear')
		}
	}

	getAllCart = async (): Promise<Carrito[]> => {
		try {
			return await this.collection.find()
		} catch (err) {
			console.log(err)
			throw new Error('Error')
		}
	}

	getCartById = async (cartId: number): Promise<any> => {
		try {
			const carts: Array<Carrito> = await this.getAllCart()
			const el = carts.findIndex((e: any) => e.id === cartId)
			const id = carts[el]._id
			return this.collection.findById(id)
		} catch (error) {
			console.log(error)
			throw new Error('error')
		}
	}

	addProduct = async (cartId: number, obj: Product): Promise<void> => {
		try {
			const productToAdd: Product = obj
			const cart: Array<Carrito> = await this.getAllCart()
			const cartIndex: number = cart.findIndex((e: any) => e.id === cartId)
			const productsInCart: Product[] = cart[cartIndex].productos
			const duplicatedIndex: number = productsInCart.findIndex((e: any) => e.id === obj.id)

			if (duplicatedIndex != -1) {
				const priceOfProduct: number = productsInCart[duplicatedIndex].precio
				let newStock: number
				if (productsInCart[duplicatedIndex].stock) {
					productsInCart[duplicatedIndex].stock++
					productsInCart[duplicatedIndex].precio = priceOfProduct * productsInCart[duplicatedIndex].stock
					await this.collection.updateOne(
						{ id: cartId },
						{
							$set: { productos: productsInCart },
						}
					)
				} else {
					productsInCart[duplicatedIndex].stock = 2
					productsInCart[duplicatedIndex].precio = priceOfProduct * productsInCart[duplicatedIndex].stock
					await this.collection.updateOne(
						{ id: cartId },
						{
							$set: { productos: productsInCart },
						}
					)
				}
			} else {
				productsInCart.push(productToAdd)
				await this.collection.updateOne(
					{ id: cartId },
					{
						$set: { productos: productsInCart },
					}
				)
			}
		} catch (e) {
			console.log(e)
			throw new Error('Error adding product')
		}
	}

	getAllProdById = async (cartId: number): Promise<Product[]> => {
		try {
			const cart: Carrito | null = await this.collection.findOne({ id: cartId })
			// const cartIndex = cart.findIndex((e: any) => e.id === cartId)
			const products: Product[] | undefined = cart?.productos

			if (products) {
				return products
			} else {
				throw new Error('No existe el carrito')
			}
		} catch {
			throw new Error('Error pidiendo los datos')
		}
	}

	deleteCartById = async (cartId: number): Promise<boolean> => {
		try {
			const cartToDelete: Array<Carrito> = await this.getAllCart()
			const cartIndex: number = cartToDelete.findIndex((e: any) => e.id == cartId)
			const _id = cartToDelete[cartIndex]._id
			if (cartToDelete.length === 0) {
				return false
			} else {
				if (cartIndex >= 0) {
					await this.collection.deleteOne({ _id: _id })
					return true
				} else {
					return false
				}
			}
		} catch (err) {
			console.log(err)
			throw new Error('No se pudo eliminar')
		}
	}

	deleteProdById = async (cartId: number, prodId: number): Promise<boolean> => {
		try {
			const carts: Array<Carrito> = await this.getAllCart()
			const cartIndex: number = carts.findIndex((e: any) => e.id == cartId)

			if (cartIndex >= 0) {
				const productsOnCart: Product[] = carts[cartIndex].productos
				const prodToDeleteIndex: number | undefined = productsOnCart.findIndex((e: any) => e.id == prodId)
				if (prodToDeleteIndex >= 0) {
					productsOnCart.splice(prodToDeleteIndex, 1)
					await this.collection.updateOne(
						{ id: cartId },
						{
							$set: { productos: productsOnCart },
						}
					)
					return true
				} else {
					return false
				}
			} else {
				return false
			}
		} catch {
			throw new Error('Error borrando el producto')
		}
	}

	deleteAllCarts = async (): Promise<boolean> => {
		try {
			await this.collection.remove()
			return true
		} catch (err) {
			console.log(err)
			throw new Error('error deleting all carts')
		}
	}
}
