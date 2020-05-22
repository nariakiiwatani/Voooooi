import { NextApiRequest, NextApiResponse } from 'next'
import { ServerContext } from '../../../libs/Models'
import { IncomingMessage, ServerResponse } from 'http'
import { UrlWithParsedQuery } from 'url'
import { newMessage } from '../../../libs/Factory'

type NextApiRequestWithContext = NextApiRequest & {
	context: ServerContext
	handle: (req: IncomingMessage, res: ServerResponse, parsedUrl?: UrlWithParsedQuery) => Promise<void>
}


const error = ({ status, message }) => (res: NextApiResponse) => {
	res.statusCode = status
	res.json({ error: message })
}

const createMessage = (req: NextApiRequestWithContext) => (res: NextApiResponse) => {
	const { rooms } = req.context
	const message = req.body
	const { roomId } = message
	const room = rooms[roomId]

	if (room === undefined) {
		return error({ status: 400, message: `roomId:${roomId} not exists` })(res)
	}
	const [id, m] = newMessage(message)
	room.messages[id] = m

	res.statusCode = 201
	res.json({ result: "ok", data: message })
}
const readMessage = (req: NextApiRequestWithContext) => (res: NextApiResponse) => {
	error({ status: 501, message: "read message is not implemented yet" })(res)
}
const updateMessage = (req: NextApiRequestWithContext) => (res: NextApiResponse) => {
	error({ status: 501, message: "update message is not implemented yet" })(res)
}
const deleteMessage = (req: NextApiRequestWithContext) => (res: NextApiResponse) => {
	error({ status: 501, message: "delete message is not implemented yet" })(res)
}

const MessageAPI = (req: NextApiRequestWithContext, res: NextApiResponse) => {
	switch (req.method) {
		case "GET":
			readMessage(req)(res)
			break;
		case "POST":
			createMessage(req)(res)
			break;
		case "UPDATE":
			updateMessage(req)(res)
			break;
		case "DELETE":
			deleteMessage(req)(res)
			break;
	}
}
export default MessageAPI