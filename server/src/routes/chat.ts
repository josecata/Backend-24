import { Router } from 'express'
import { save as saveMessages, get as getMessages } from '../Controllers/MongoDB/messages'
import {normalizeMsg} from '../Controllers/MongoDB/normalizr'

interface Author {
	id: number
	firstName: string
	lastName: string
	age: number
	alias: string
	avatar: string
}

interface Message {
	author: Author
	text: string
}

export const chat: Router = Router()

chat
	.route('/chat')
	.get(async (req, res) => {
		const messages = await getMessages()
		const normMessages = normalizeMsg(messages)
		if (messages.length != 0) {
			res.status(200).json({messages, normMessages})
		} else {
			res.status(404).json({ error: 'No messages' })
		}
	})
	.post(async (req, res) => {
		const message: Message = req.body
		saveMessages(message)
		res.status(202).json({ OK: 'Mensaje subido' })
	})
