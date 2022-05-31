import 'dotenv/config'

let productsDao: any
let cartDao: any

const { default: DaoMongoCart } = await import('./cart/CartMongoDB')
const { default: DaoMongoProduct } = await import('./products/ProductsMongoDB')

cartDao = new DaoMongoCart()
productsDao = new DaoMongoProduct()
export { productsDao, cartDao }
