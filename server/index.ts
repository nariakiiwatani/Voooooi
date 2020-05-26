import { parse } from 'url'
import next from 'next'
import socketIO from 'socket.io'
import { createServer } from 'http'
import { ServerContext } from "../libs/Models"
import fetch from "node-fetch"


const context: ServerContext = {
	io: null,
	rooms: [],
	teams: [],
	users: [],
	messages: [],
}

const dev = process.env.NODE_ENV !== 'production'

const port = parseInt(process.env.PORT || '3000', 10)
const origin = dev ? "http://localhost" : ""
const apiUrl = `${origin}:${port}/api`

const app = next({ dev })
const handle = app.getRequestHandler()

const requestListener = (req: any, res: any) => {
	// Be sure to pass `true` as the second argument to `url.parse`.
	// This tells it to parse the query portion of the URL.
	const parsedUrl = parse(req.url, true)
	req.context = context
	handle(req, res, parsedUrl)
}

app.prepare().then(() => {
	const server = createServer(requestListener)

	context.io = socketIO(server)
	const io = context.io
	io.on('connection', client => {
		console.log(client.id, 'connected')
		client.on('disconnect', () => {
			console.log(client.id, 'disconnected')
		})
		client.on("message", (message) => {
			const m = {
				...message,
				timestamp: new Date().getTime()
			}
			io.to(message.roomId).emit("message", m)
			fetch(`${apiUrl}/messages`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json; charset=utf-8",
				},
				body: JSON.stringify(m)
			})
				.then(result => result.json())
				.then(response => console.log("posted", response))
		})
		client.on("join", (roomId) => {
			console.info("join to :", roomId)
			client.join(roomId)
		})
	})

	server.listen(port, () => {
		console.log(`> Ready on ${origin}:${port}`)
	})
})