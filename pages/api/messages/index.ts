import { NextApiRequest, NextApiResponse } from 'next'
import { ServerContext, defaultRoom } from '../../../libs/Models'
import { firstOf } from "../../../libs/Utils"
import { IncomingMessage, ServerResponse } from 'http'
import { UrlWithParsedQuery, parse } from 'url'

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
	console.log(message)
	const { roomId } = message
	if (!(roomId in rooms)) {
		return error({ status: 400, message: `room:${roomId} not exists` })(res)
	}
	rooms[roomId].messages.push({ ...message })

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