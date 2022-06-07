/* Init required variables */
import express from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import passport from 'passport'
import passportLocal from 'passport-local'
import http from 'http'
import { Server } from 'socket.io'
import cors from 'cors'



// Controllers
import { routerProduct, routerCart } from './routes/api'
import routerFakeProducts from './routes/products-test'
import { chat } from './routes/chat'
import { login } from './routes/login'
import { save as saveMessages, get as getMessages } from './Controllers/MongoDB/messages'


// Init middlewares

const app = express()
app.use(
	session({
		secret: 'shhhhhh',
		resave: true,
		saveUninitialized: true,
	})
)
app.use(
	cors({
		origin: 'http://localhost:3000',
		credentials: true,
	})
)
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(bodyParser.json())

app.use(passport.initialize())
app.use(passport.session())
// Passport
const LocalStrategy = passportLocal.Strategy



// Routes

app.use(routerProduct)
app.use(routerCart)
app.use(routerFakeProducts)
app.use(chat)
app.use(login)

const server = http.createServer(app)

const io = new Server(server, {
	cors: {
		origin: 'http://localhost:3000',
		methods: ['GET', 'POST'],
	},
})

io.on('connection', (socket) => {
	console.log(`User Connected: ${socket.id}`)

	socket.on('disconnect', () => {
		console.log('user disconnected', socket.id)
	})

	socket.on('join_room', (data: string) => {
		socket.join(data)
		console.log(`user with ID: ${socket.id} connect to room: ${data}`)
	})

	socket.on('send_message', (data) => {
		saveMessages(data)
		socket.to('testRoom').emit('receive_message', data)
	})
})

/* Server listener */
const PORT: string | number = process.env.PORT || 8080
server.listen(PORT, () => {
	console.log(`Contectando al puerto: ${PORT}`)
})
