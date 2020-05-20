import { parse } from 'url'
import next from 'next'
import socketIO from 'socket.io'
import { createServer } from 'http'

const context = {
	io: null
}

const dev = process.env.NODE_ENV !== 'production'
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
	const port = parseInt(process.env.PORT || '3000', 10)

	const server = createServer(requestListener)

	context.io = socketIO(server)
	context.io.on('connection', client => {
		console.log(client.id, 'connected')
		client.on('disconnect', () => {
			console.log(client.id, 'disconnected')
		})
		client.on("message", (message) => {
			console.log("received:", message)
			client.emit("message", message)
		})
	})

	server.listen(port, () => {
		console.log(`> Ready on http://localhost:${port}`)
	})
})