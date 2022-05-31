import React, { useEffect, useState } from 'react'

interface Props {
	product: {
		id: number
		timestamp: number
		nombre: string
		descripcion: string
		codigo: string
		url: string
		precio: string
		stock?: number
	}
}

const Product: React.FC<Props> = ({ product }) => {
	const [admin, setAdmin] = useState(true)
	const [edit, setEdit] = useState(false)

	const idProd = String(product.id)

	const handleEdit = () => {
		if (edit) {
			setEdit(false)
		} else {
			setEdit(true)
		}
	}

    // Actualizar producto
    const [nombre, setNombre] = useState('')
    const [descripcion, setDescripcion] = useState('')
    const [precio, setPrecio] = useState(0)
    const [url, setUrl] = useState('')
    const [mensaje, setMensaje] = useState('')
	const [mensajeDel, setMensajeDel] = useState('')


	const handleSubmit = async (e:any) => {
		e.preventDefault()
        try {
			let res = await fetch('http://localhost:8080/api/productos/', {
				method: 'PUT',
				headers: {
					'Content-type': 'application/json',
				},
				body: JSON.stringify({
					nombre: nombre,
					descripcion: descripcion,
					url: url,
					precio: precio,
                    id: product.id
				}),
			})
			let resJson = await res.json()
			if (res.status === 202) {
				setNombre('')
				setDescripcion('')
				setUrl('')
				setPrecio(0)
				setMensaje('Producto modificado')
			} else {
				setMensaje('Error modificando el producto')
			}
		} catch (err) {
			console.log(err)
		}
	}

	const handleDelete = async (e:any) =>{
		e.preventDefault()
		try {
			let res = await fetch('http://localhost:8080/api/productos/', {
				method: 'DELETE',
				headers: {
					'Content-type': 'application/json',
				},
				body: JSON.stringify({
                    id: product.id
				}),
			})
			let resJson = await res.json()
			if (res.status === 202) {
				setMensajeDel('Producto eliminado')
			} else {
				setMensajeDel('Error eliminando el producto')
			}
		} catch (err) {
			console.log(err)
		}
	}
	return (
		<>
			{!product ? (
				<div>Loading...</div>
			) : (
				<div key={product.id} id={idProd} className='product'>
					<span>Nombre: {product.nombre} </span>
					<span>Descripcion: {product.descripcion} </span>
					<span>Precio: {product.precio} </span>
					<img src={product.url} alt='' />
					{admin ? <button onClick={handleEdit}>Editar</button> : null}
					{edit ? (
						<>
							<div className='update'>
								<form onSubmit={handleSubmit}>
									<input type='text' name='nombre' placeholder='nombre' onChange={e=>setNombre(e.target.value)}/>
									<input type='text' name='descripcion' placeholder='descripcion' onChange={e=>setDescripcion(e.target.value)}/>
									<input type='number' name='precio' placeholder='precio' onChange={e=>setPrecio(Number(e.target.value))}/>
									<input type='text' name='url' placeholder='url' onChange={e=>setUrl(e.target.value)}/>
									<button type='submit'>Actualizar producto</button>
								</form>
								<div>{mensaje ? <p>{mensaje}</p> : null}</div>
							</div>

							<button onClick={handleDelete}>Eliminar producto</button>
							<div>{mensajeDel ? <p>{mensajeDel}</p> : null}</div>
						</>
					) : null}
				</div>
			)}
		</>
	)
}

export default Product
