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
	const [btnPressed, setBtnPressed] = useState<boolean>(false)
	const [user, setUser] = useState<string>()
	const [password, setPassword] = useState<string>()
	const [systemMessage, setSystemMessage] = useState<string>()

	const login = async (e: any) => {
		e.preventDefault()
		try {
			setBtnPressed(true)
			await fetch('http://localhost:8080/login', {
				method: 'POST',
				headers: {
					'Content-type': 'application/json',
					'Access-Control-Allow-Credentials': 'true',
				},
				credentials: 'include',
				body: JSON.stringify({
					user: user,
					password:password
				}),
			})
				.then((res) => console.log(res))
				// .then((data) => {
				// 	!data.error ? setIsLoged(true) : setSystemMessage('Error al logear');console.log(data)
				// })
			setBtnPressed(false)
		} catch (err) {
			console.log(err)
			throw new Error('error loging')
		}
	}

	const logout = async () => {
		try {
			const data = await fetch('http://localhost:8080/logout', {
				method: 'POST',
				headers: {
					'Content-type': 'application/json',
					'Access-Control-Allow-Credentials': 'true',
				},
				credentials: 'include',
			})
				.then((res) => res.json())
				.then((data) => {
					if (data.ok) {
						setIsLoged(false)
						window.location.href = '/'
					} else setSystemMessage('Error logging out')
				})
		} catch (err) {
			console.log(err)
			throw new Error('Error logout')
		}
	}

	return (
		<BrowserRouter>
			<main>
				{!isLoged ? (
					<div className='login'>
						<h2>Login</h2>
						<form>
							<input type='text' placeholder='email' name='email' onChange={(e) => setUser(e.target.value)} />
							<input type='password' placeholder='password' name='password' onChange={(e) => setPassword(e.target.value)} />
							<button onClick={login} disabled={btnPressed}>
								Enviar
							</button>
						</form>
						{systemMessage ? <p>{systemMessage}</p> : null}
					</div>
				) : (
					<>
						<Routes>
							<Route path='/' element={<ProductList user={user} logout={logout} />} />
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
