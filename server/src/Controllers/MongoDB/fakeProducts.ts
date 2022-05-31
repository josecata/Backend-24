import {faker} from '@faker-js/faker'
import 'dotenv/config'

interface Product {
    name: string
    price: number
    image: string
}

const qtyToCreate:number = Number(process.env.qty)

export const createProducts = async()=>{
    let products: Product[] = []

    for(let i=0;i<qtyToCreate;i++){
        const productCreated = {
            name: faker.commerce.productName(),
            price: Number(faker.commerce.price()),
            image: faker.image.imageUrl()
        }
        products.push(productCreated)
    }

    return products

}