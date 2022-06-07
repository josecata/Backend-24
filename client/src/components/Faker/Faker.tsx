import React, { useEffect, useState } from 'react'

interface Product {
    name: string
    price: number
    image: string
}

const Faker: React.FC = () => {

    const [fakeProducts, setFakeProducts] = useState<Product[]>([])

    const getProducts = () =>{
        try{
            fetch('http://localhost:8080/productos-test',{method:'GET'}).then(res=>res.json()).then(data=>setFakeProducts(data))
        }catch(err){
            console.log(err)
            throw new Error('Error getting faker')
        }
    }

    useEffect(()=>{
        getProducts()
    },[])


	return <>
        {fakeProducts.map((p)=>{
            return(
                <tr>
                    <td>{p.name}</td>
                    <td>{p.price}</td>
                    <td><img src={p.image} alt="" /></td>
                </tr>
            )
        })}
    </>
}

export default Faker
