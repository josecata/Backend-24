import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const Cart: React.FC = () => {
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

	interface Cart {
		productos: any[]
	}

	const [created, setCreated] = useState(false)
	const [idCart, setIdCart] = useState<number>()
	const [idProd, setIdProd] = useState<number>()
	const [tempCart, setTempCart] = useState<Array<Cart> | []>()
	const [tempProducts, setTempProducts] = useState<Product | any>([])
	const [mensaje, setMensaje] = useState<string>('')

	const createCart = async (e: any) => {
		e.preventDefault()
		const res = await fetch('http://localhost:8080/api/carrito/', {
			method: 'POST',
			headers: {
				'Content-type': 'application/json',
			},
		})
		let resJson = await res.json()
		setIdCart(resJson)
		setCreated(true)
	}

	const addProduct = async (e: any) => {
		try {
			e.preventDefault()
			await fetch('http://localhost:8080/api/carrito/:id/productos', {
				method: 'POST',
				headers: {
					'Content-type': 'application/json',
				},
				body: JSON.stringify({
					id: idCart,
					id_prod: idProd,
				}),
			})

			let res = await fetch('http://localhost:8080/api/productos/', {
				method: 'GET',
				headers: {
					'Content-type': 'application/json',
				},
			})
			let resJson = await res.json()

			const productsInCart: Product[] = tempProducts

			const prodIndex = resJson.findIndex((e: { id: number }) => e.id === idProd)

			if (prodIndex != -1) {
				const rep = productsInCart.findIndex((e: any) => e.id == resJson[prodIndex].id)

				if (rep === -1) {
					// setTempProducts((prev: any) => [...prev, { ...resJson[prodIndex], stock: 1 }])
					productsInCart.push({ ...resJson[prodIndex], stock: 1 })
				} else {
					productsInCart[rep].stock++
					// tempProducts[rep].stock++
				}
				setTempProducts(productsInCart)
				setTempCart([
					{
						productos: [...tempProducts],
					},
				])
				setMensaje('Producto agregado')
			} else {
				setMensaje('Error agregando el producto')
			}
		} catch (error) {
			console.log(error)
		}
	}

	const deleteItem = async (e: any) => {
		e.preventDefault()
		const tempId = Number(e.target.parentElement.id)

		await fetch('http://localhost:8080/api/carrito/:id/productos/:id_prod', {
			method: 'DELETE',
			headers: {
				'Content-type': 'application/json',
			},
			body: JSON.stringify({
				id: idCart,
				id_prod: tempId,
			}),
		})

		const productsInCart = tempProducts
		const delIndex = productsInCart.findIndex((e: any) => e.id == tempId)
		if (delIndex != -1) {
			productsInCart.splice(delIndex, 1)
			setTempProducts(productsInCart)
			setTempCart([
				{
					productos: [...tempProducts],
				},
			])
			setMensaje('Producto eliminado')
		}
	}
	const deleteCart = async (e: any) => {
		e.preventDefault()
		setTempProducts([])
		setTempCart([
			{
				productos: [...tempProducts],
			},
		])
		setMensaje('Productos eliminados')
		await fetch('http://localhost:8080/api/carrito', {
			method: 'DELETE',
			headers: {
				'Content-type': 'application/json',
			},
			body: JSON.stringify({
				id: idCart,
			}),
		})
	}

	return (
		<div>
			{created ? (
				<>
					<h1>Carrito</h1>
					{!tempCart ? (
						<div>Esperando productos...</div>
					) : (
						<>
							{tempCart.map(() => {
								return (
									<div id={String(idCart)}>
										{tempProducts.map((prod: Product, i: number) => {
											return (
												<div key={i} id={String(prod.id)}>
													<span>Nombre: {prod.nombre} </span>
													<span>Precio: {prod.precio * prod.stock} </span>
													<span>Cantidad: {prod.stock}</span>
													<img src={prod.url} alt='' />
													<button onClick={deleteItem}>Eliminar</button>
												</div>
											)
										})}
									</div>
								)
							})}
						</>
					)}
					<button onClick={deleteCart}>Vaciar carrito</button>
					<form onSubmit={addProduct}>
						<h3>Agregar productos al carrito</h3>
						ID: <input type='number' name='id' placeholder='Id' onChange={(e) => setIdProd(Number(e.target.value))} />
						<button type='submit'>Agregar</button>
					</form>
					<div>{mensaje ? <p>{mensaje}</p> : null}</div>
				</>
			) : (
				<button onClick={createCart}>Crear nuevo carrito</button>
			)}
			<br />
			<Link to='/'>Volver al menu</Link>
		</div>
	)
}

export default Cart
