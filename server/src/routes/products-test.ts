import { Router } from 'express'
import { createProducts } from '../Controllers/MongoDB/fakeProducts'

interface Product {
	name: string
	price: number
	image: string
}

const routerFakeProducts = Router()

routerFakeProducts
	.route('/productos-test')
	.get(async (req, res) => {
		const productsFake: Product[] = await createProducts()

		if (productsFake.length > 0) {
			res.status(200).json(productsFake)
		} else {
			res.status(404).send({ message: 'Products Not Found' })
		}
	})

export default routerFakeProducts