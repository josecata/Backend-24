import React, { useEffect, useState } from 'react'
import io from 'socket.io-client'
import { schema, denormalize } from 'normalizr'

const socket = io('http://localhost:8080/')

interface Author {
	id: string
	firstName: string
	lastName: string
	age: number
	alias: string
	avatar: string
}

interface Messages {
	author: Author
	text: string
}

const Chat: React.FC = () => {
	const [compression, setCompression] = useState<number>()

	const [systemMessage, setSystemMessage] = useState<string>('Empty chat')
	const [messagesList, setMessagesList] = useState<Messages[]>([])

	const [firstName, setFirstName] = useState<string>('')
	const [lastName, setLastName] = useState<string>('')
	const [age, setAge] = useState<number>(0)
	const [alias, setAlias] = useState<string>('')
	const [avatar, setAvatar] = useState<string>('')
	const [newMessage, setNewMessage] = useState<string>('')
	const [email, setEmail] = useState<string>('')

	const [room] = useState<string>('testRoom')
	socket.emit('join_room', room)

	//normalizr esquemas
	const authorsSchema = new schema.Entity('authors')
	const msjSchema = new schema.Entity('messages', { author: authorsSchema }, { idAttribute: 'id' })
	const fileSchema = [msjSchema]

	const getMessages = () => {
		try {
			fetch('http://localhost:8080/chat', {
				method: 'GET',
				headers: {
					'Content-type': 'application/json',
				},
			})
				.then((res) => res.json())
				.then((data) => {
					if (data.error) {
						setSystemMessage('Empty chat')
					} else {
						const messages = data.messages // Mensajes sin normalizr
						const normMessages = data.normMessages // Mensajes normalizados
						const normMessagesLength = JSON.stringify(normMessages).length // Length del normalizado
						const desnormMessages = denormalize(normMessages.result, fileSchema, normMessages.entities) // Mensajes denormalizados
						const desnormMessagesLength = JSON.stringify(desnormMessages).length // Length del denormalizado
						const compression = Number((((normMessagesLength - desnormMessagesLength) / normMessagesLength) * 100).toFixed(2)) // Calculo la compresión
						setMessagesList(messages)
						setCompression(compression)
					}
				})
		} catch (err) {
			console.log(err)
			throw new Error('Error with chat')
		}
	}

	useEffect(() => {
		getMessages()
		socket.on('receive_message', (data) => {
			setMessagesList((list) => [...list, data])
		})
	}, [socket])

	const sendMessage = async (e: any) => {
		e.preventDefault()
		const messageData: Messages = {
			author: {
				id: email,
				firstName: firstName,
				lastName: lastName,
				age: age,
				alias: alias,
				avatar: avatar,
			},
			text: newMessage,
		}
		try {
			if (firstName && lastName && age && alias && avatar && newMessage) {
				socket.emit('send_message', messageData)
				setMessagesList((list) => [...list, messageData])
			}
		} catch (err) {
			console.log(err)
			throw new Error('Error sending message')
		}
	}

	return (
		<>
			<h1>Central de mensajes</h1>
			<h5>Compresión de los mensajes: {compression ? `${compression}%`:``}</h5>
			<form onSubmit={sendMessage} className='register'>
				<input type='text' name='email' placeholder='Email' onChange={(e) => setEmail(e.target.value)} />
				<input type='text' name='firstName' placeholder='First Name' onChange={(e) => setFirstName(e.target.value)} />
				<input type='text' name='lastName' placeholder='Last Name' onChange={(e) => setLastName(e.target.value)} />
				<input type='number' name='age' placeholder='Age' onChange={(e) => setAge(Number(e.target.value))} />
				<input type='text' name='alias' placeholder='Alias' onChange={(e) => setAlias(e.target.value)} />
				<input type='text' name='avatar' placeholder='avatar(url)' onChange={(e) => setAvatar(e.target.value)} />
				<input type='text' name='message' placeholder='Type your message' onChange={(e) => setNewMessage(e.target.value)} />
				<button type='submit'>Enviar</button>
			</form>
			<div className='chat'>
				{messagesList.length == 0 ? (
					<p>{systemMessage}</p>
				) : (
					messagesList.map((msg, i) => {
						return (
							<>
								<div className='message'>
									<img src={msg.author.avatar} alt='' />
									<span>{msg.author.alias}: </span>
									<span>{msg.text}</span>
								</div>
							</>
						)
					})
				)}
			</div>
		</>
	)
}

export default Chat
