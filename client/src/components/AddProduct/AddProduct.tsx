import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const AddProduct: React.FC = () => {
	const [nombre, setNombre] = useState('')
	const [descripcion, setDescripcion] = useState('')
	const [codigo, setCodigo] = useState('')
	const [url, setUrl] = useState('')
	const [precio, setPrecio] = useState('')
	const [mensaje, setMensaje] = useState('')
	const [stock, setStock] = useState('')

	const handleSubmit = async (e: any) => {
		e.preventDefault()
		try {
			let res = await fetch('http://localhost:8080/api/productos', {
				method: 'POST',
				headers: {
					'Content-type': 'application/json',
				},
				body: JSON.stringify({
					nombre: nombre,
					descripcion: descripcion,
					codigo: codigo,
					url: url,
					precio: precio,
					// stock:stock
				}),
			})
			let resJson = await res.json()
			if (res.status === 200) {
				setNombre('')
				setDescripcion('')
				setCodigo('')
				setUrl('')
				setPrecio('')
				setStock('')
				setMensaje('Producto creado')
			} else {
				setMensaje('Error creando el producto')
			}
		} catch (err) {
			console.log(err)
		}
	}

	return (
		<>
			<form onSubmit={handleSubmit}>
				<h2>Agregar productos</h2>
				<input type='text' name='nombre' placeholder='Nombre' onChange={(e) => setNombre(e.target.value)} />
				<input type='text' name='descripcion' placeholder='Descripcion' onChange={(e) => setDescripcion(e.target.value)} />
				<input type='text' name='codigo' placeholder='Codigo' onChange={(e) => setCodigo(e.target.value)} />
				<input type='text' name='url' placeholder='Imagen(url)' onChange={(e) => setUrl(e.target.value)} />
				<input type='number' name='precio' placeholder='Precio' onChange={(e) => setPrecio(e.target.value)} />
				{/* <input type='stock' name='stock' placeholder='Stock' onChange={(e) => setStock(e.target.value)} /> */}
				<button type='submit'>Agregar</button>

				<div>{mensaje ? <p>{mensaje}</p> : null}</div>
			</form>
            <Link to='/'>Volver al menu</Link>
		</>
	)
}

export default AddProduct
