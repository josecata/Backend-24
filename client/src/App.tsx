import React, { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import AddProduct from './components/AddProduct/AddProduct'
import AddCart from './components/AddCart/AddCart'
import ProductList from './components/ProductList/ProductList'
import './Styles/App.css'
import Chat from './components/Chat/Chat'
import Faker from './components/Faker/Faker'

const App: React.FC = () => {
	const [isLoged, setIsLoged] = useState<boolean>(false)
	const [systemMessage, setSystemMessage] = useState<string>()
	const [user, setUser] = useState<string>()

	const login = async (e: any) => {
		e.preventDefault()
		const data = await fetch('http://localhost:8080/login', {
			method: 'POST',
			headers: {
				'Content-type': 'application/json',
			},
			body: JSON.stringify({
				user: user,
			}),
		}).then(res=>res.json()).then(data=>{!data.error ? setIsLoged(true) : setSystemMessage('Error al logear')})

	}

	return (
		<BrowserRouter>
			<main>
				{!isLoged ? (
					<div className='login'>
						<h2>Login</h2>
						<p>Ingrese su usuario</p>
						<form onSubmit={login}>
							<input type='text' placeholder='user' name='user' onChange={(e) => setUser(e.target.value)} />
							<button>Enviar</button>
						</form>
						{systemMessage ? <p>{systemMessage}</p> : null}
					</div>
				) : (
					<>
						<Routes>
							<Route path='/' element={<ProductList/>} />
							<Route path='/addProduct' element={<AddProduct />} />
							<Route path='/addCart' element={<AddCart />} />
							<Route path='/chat' element={<Chat />} />
							<Route path='/faker' element={<Faker />} />
						</Routes>
					</>
				)}
			</main>
		</BrowserRouter>
	)
}
export default App
