/* Init required variables */
import { Router } from 'express'
import passport from 'passport'
import passportLocal from 'passport-local'
import { Request, Response } from 'express'
import { authDao as auth } from '../DAOS/index'
import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import config from '../config'
import User from '../Controllers/MongoDB/User'

const LocalStrategy = passportLocal.Strategy

// Interface

interface User {
	user: string
	password: string
}

// Run mongoose
const runMongoose = async () => {
	await mongoose.connect(config.mongodb.path)
}

runMongoose().catch((err) => {
	console.log(err)
	throw new Error('error con mongoose')
})

passport.use(
	new LocalStrategy((user, password, done) => {
		User.findOne({ user: user }, (err, user: any) => {
			if (err) throw err
			if (!user) return done(null, false)
			bcrypt.compare(password, user.password, (err, result) => {
				if (err) throw err
				if (result === true) {
					return done(null, user)
				} else {
					return done(null, false)
				}
			})
		})
	})
)

passport.serializeUser((user: any, cb) => {
	cb(null, user.id)
})
passport.deserializeUser((id: string, cb) => {
	User.findOne({ _id: id }, (err, user: any) => {
		const userInformation = {
			user: user.user,
			isAdmin: user.isAdmin,
		}
		cb(err, userInformation)
	})
})

export const login: Router = Router()

login.post('/register', async (req, res) => {
	try {
		const { user, password } = req.body

		if (!user || !password || typeof user !== 'string' || typeof password !== 'string') {
			return res.status(400).json({ error: 'invalid user' })
		}

		User.findOne({ user }, async (err: Error, doc: User) => {
			if (err) throw err
			if (doc) return res.status(400).json({ error: 'user exist' })
			if (!doc) {
				const hashedPassword = await bcrypt.hash(password, Number(process.env.saltBcrypt))
				const newUser = new User({ user, password: hashedPassword })
				await newUser.save()
				return res.status(200).json({ ok: 'ok' })
			}
		})
	} catch (err) {
		console.log(err)
		throw new Error('error register')
	}
})
login.post('/login', passport.authenticate('local'), (req, res) => {
	res.send('success')
})
login.get('/user', (req, res) => {
	res.status(200).json({ user: req.user })
})