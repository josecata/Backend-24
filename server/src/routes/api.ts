/* Init required variables */
import { Router } from 'express'
import bodyParser from 'body-parser'
import {productsDao as products, cartDao as cart} from '../DAOS/index'


const admin = true

/* ---------------------------------------------------------------- */

/* API Router */

/* Products */
export const routerProduct: any = Router()
routerProduct.use(bodyParser.json())

routerProduct
	.route('/api/productos/:id?')
	.get(async (req: any, res: any, next: any) => {
		let id: number
		if (req.body.id) {
			id = Number(req.body.id)
		} else {
			id = Number(req.params.id)
		}
		if (id) {
			const product = await products.getById(id)
			product ? res.status(200).json(product) : res.status(404).json({ error: ' Error with ID ' })
		} else {
			const allProducts: object[] = await products.getAll()
			allProducts ? res.status(200).json(allProducts) : res.status(404)
		}
	})
	.post(async (req: any, res: any) => {
		if (admin) {
			if (req.params.id) {
				res.status(400).json({ error: ' No se puede crear un producto con un id' })
			} else {
				const newObj: object = req.body
				const newId: number = products.save(newObj)
				res.status(200).json(`El producto ${req.body.nombre} con el id ${newId} se generó correctamente`)
			}
		} else {
			res.status(401).json({ error: -1, descripcion: 'Permisos denegados' })
		}
	})
	.put(async (req: any, res: any) => {
		if (admin) {
			const newValues: object = req.body
			let id: number
			if (req.body.id) {
				id = Number(req.body.id)
			} else {
				id = Number(req.params.id)
			}
			products.modifyById(newValues, id).then((result) => (result ? res.status(202).json('Producto modificado') : res.status(404).json('No se encontró el producto')))
		} else {
			res.status(401).json({ error: -1, descripcion: 'Permisos denegados' })
		}
	})
	.delete(async (req: any, res: any) => {
		if (admin) {
			let id: number
			if (req.body.id) {
				id = Number(req.body.id)
			} else {
				id = Number(req.params.id)
			}
			products.deleteById(id).then((result) => (result ? res.status(202).json('Producto eliminado') : res.status(404).json({ error: 'El producto no existe' })))
		} else {
			res.status(401).json({ error: -1, descripcion: 'Permisos denegados' })
		}
	})

/* Cart */
export const routerCart: Router = Router()
routerCart.use(bodyParser.json())

routerCart
	.route('/api/carrito/:id?')
	.post(async (req: any, res: any) => {
		if (req.params.id) {
			res.status(400).json({ error: 'No se puede crear un carrito con ID manual' })
		} else {
			const id = await cart.create()

			res.status(200).json(id)
		}
	})
	.delete(async (req: any, res: any) => {
		let id: number
		if (req.body.id) {
			id = Number(req.body.id)
		} else {
			id = Number(req.params.id)
		}
		cart.deleteCartById(id).then((result) => (result ? res.status(202).json('Carrito eliminado') : res.status(404).json('No se encontró el carrito')))
	})

routerCart
	.route('/api/carrito/:id?/productos')
	.get(async (req: any, res: any) => {
		let id: number
		if (req.body.id) {
			id = Number(req.body.id)
		} else {
			id = Number(req.params.id)
		}
		if (id) {
			const products = await cart.getAllProdById(id)
			products ? res.status(200).json(products) : res.status(404).json({ error: 'No se encontró el carrito solicitado' })
		} else {
			res.status(404).json({ error: 'Es necesario un ID para buscar el carrito' })
		}
	})
	.post(async (req: any, res: any) => {
		let id: number
		if (req.body.id) {
			id = Number(req.body.id)
		} else {
			id = Number(req.params.id)
		}
		let id_prod: number = Number(req.body.id_prod)
		const product = await products.getById(id_prod)
		cart.addProduct(id, product)
		res.status(202).json(`El producto fue agregado al carrito.`)
	})

routerCart.delete('/api/carrito/:id?/productos/:id_prod', async (req: any, res: any) => {
	let id: number
	let id_prod: number
	if (req.body.id) {
		id = Number(req.body.id)
		id_prod = Number(req.body.id_prod)
	} else {
		id = Number(req.params.id)
		id_prod = Number(req.params.id_prod)
	}
	;(await cart.deleteProdById(id, id_prod)) ? res.status(202).json(`El producto fue eliminado`) : res.status(400).json('No se encontró el producto a eliminar')
})

// routerProduct
// 	.get('*', (req: any, res: any) => {
// 		res.status(404).json({ error: -2, descripcion: 'URL Inexistente' })
// 	})
// 	.post('*', (req: any, res: any) => {
// 		res.status(404).json({ error: -2, descripcion: 'URL Inexistente' })
// 	})
// routerCart
// 	.get('*', (req: any, res: any) => {
// 		res.status(404).json({ error: -2, descripcion: 'URL Inexistente' })
// 	})
// 	.post('*', (req: any, res: any) => {
// 		res.status(404).json({ error: -2, descripcion: 'URL Inexistente' })
// 	})
