import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Product from '../Product/Product'

interface Product {
	id: number
	timestamp: number
	nombre: string
	descripcion: string
	codigo: string
	url: string
	precio: string
	stock?: number
}

const ProductList: React.FC = () => {
	const [backendData, setBackendData] = useState<Product[] | undefined>(undefined)
	const [admin, setAdmin] = useState<boolean>(true)
	const [user, setUser] = useState<string>()

	useEffect(() => {
		fetch('/api/productos')
			.then((response: any = {}) => response.json())
			.then((data: any = {}) => {
				if (data.length != 0) {
					setBackendData(data)
				}
			})
		fetch('http://localhost:8080/user')
			.then((res) => res.json())
			.then((data) => {
				if (!data.error) setUser(data.user)
			})
	}, [])

	const logout = () => {
		fetch('http://localhost:8080/logout')
		
	}

	return (
		<>
			<div className='logged'>
				<p>Hola {user}</p>
				<button onClick={logout}>Logout</button>
			</div>
			<div className='product-list'>
				{backendData === undefined ? (
					<p>Esperando productos...</p>
				) : (
					backendData.map((product: any, i: any) => {
						return <Product key={i} product={product} />
					})
				)}
			</div>
			{admin ? <Link to='/addProduct'>Agregar producto</Link> : null}

			<Link to='/addCart'>Agregar un nuevo carrito</Link>
			<Link to='/chat'>Chat</Link>
			<Link to='/faker'>Fake products</Link>
		</>
	)
}

export default ProductList
