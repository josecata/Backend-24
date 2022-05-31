/* Init required variables */
import { Router } from 'express'

declare module 'express-session' {
	export interface SessionData {
		user: { [key: string]: string }
	}
}

export const login: Router = Router()

login.route('/login').post((req, res) => {
	let user = req.body.user
	req.session.user = user
	console.log(req.session)
	if (req.session.user) {
		res.status(200).json({user: req.session.user})
	} else {
		res.status(400).json({error:'Error logging'})
	}
})

login.route('/user').get(async (req, res) => {
	console.log(req.session)
	if (req.session.user) {
		res.status(200).json(req.session.user)
	} else {
		res.status(404).json({ error: 'Error getting username' })
	}
})

login.route('/logout').get(async (req, res) => {
	req.session.destroy((err) => {
		if (!err) res.status(200)
		else res.status(400)
	})
})
