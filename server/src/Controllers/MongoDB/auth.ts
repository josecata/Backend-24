import mongoose, { Model, ObjectId, Schema } from 'mongoose'
import config from '../../config'
import bcryptjs from 'bcrypt'
import 'dotenv/config'

const runMongoose = async () => {
	await mongoose.connect(config.mongodb.path)
}

runMongoose().catch((err) => {
	console.log(err)
	throw new Error('error con mongoose')
})

interface User {
	user: string
	password: string
}

export default class Auth {
	private salt: number
	private collection: Model<User>
	constructor(nameCollection: string, schema: Schema<User>) {
		this.salt = Number(process.env.saltBcrypt)
		this.collection = mongoose.model(nameCollection, schema)
	}
	private encript = async (password: string): Promise<string> => {
		try {
			const salt = await bcryptjs.genSalt(this.salt)
			return await bcryptjs.hash(password, salt)
		} catch (err) {
			console.log(err)
			throw new Error('Error encrypting')
		}
	}
	private compare = async (password: string, hash: string): Promise<boolean> => {
		try {
			return await bcryptjs.compare(password, hash)
		} catch (err) {
			console.log(err)
			throw new Error('Error compare')
		}
	}
	register = async (user: string, password: string) => {
		try {
			if (!user || !password || typeof user !== 'string' || typeof password !== 'string') {
				return { error: 'invalid user' }
			}
			await this.collection.findOne({ user: user }, async (err: Error, doc: User) => {
				if (err) throw err
				if (doc) return { error: 'user exist' }
				if (!doc) {
					const hashedPassword = await this.encript(password)
					const newUser = new this.collection({ user: user, password: hashedPassword })
					await newUser.save()
					return { ok: 'ok' }
				}
			})
		} catch (err) {
			console.log(err)
			throw new Error('error in register')
		}
	}
	login = async (user: string, password: string): Promise<object> => {
		try {
			const userValidate: any = await this.collection.findOne({ user: user })
			if (!userValidate) {
				return { error: 'user invalid' }
			}
			const checkCredentials = userValidate.user == user && this.compare(password, await this.encript(password))
			if (!checkCredentials) {
				return { error: 'invalid credentials' }
			}
			return { ok: 'Ok' }
		} catch (err) {
			console.log(err)
			throw new Error('Error logging')
		}
	}
	exist = async (user: string): Promise<User | null> => {
		try {
			return await this.collection.findOne({ user: user })
		} catch (err) {
			console.log(err)
			throw new Error('Error getting users')
		}
	}
	LocalStrategy = async (user, password, done) => {
		await this.collection.findOne({ user: user }, async (err, user: any) => {
			if (err) throw err
			if (!user) return done(null, false)
			await bcryptjs.compare(password, user.password, (err, result) => {
				if (err) throw err
				if (result === true) {
					return done(null, user)
				} else {
					return done(null, false)
				}
			})
		})
	}
}
