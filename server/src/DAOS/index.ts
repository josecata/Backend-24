import 'dotenv/config'

let productsDao: any
let cartDao: any
let authDao: any

const { default: DaoMongoCart } = await import('./cart/CartMongoDB')
const { default: DaoMongoProduct } = await import('./products/ProductsMongoDB')
const { default: DaoMongoAuth } = await import('./auth/authMongoDB')

cartDao = new DaoMongoCart()
productsDao = new DaoMongoProduct()
authDao = new DaoMongoAuth()
export { productsDao, cartDao, authDao }
