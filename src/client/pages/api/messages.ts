import { NextApiRequest, NextApiResponse } from 'next'
import { ServerContext } from '../../libs/Models'
import { findOneByProps, findByProps } from '../../libs/Utils'
import { newMessage } from '../../libs/Factory'

type NextApiRequestWithContext = NextApiRequest & {
	context: ServerContext
}
const error = ({ status, message }) => (res: NextApiResponse) => {
	res.statusCode = status
	res.json({ error: message })
}

const createMessage = (req: NextApiRequestWithContext) => (res: NextApiResponse) => {
	const { context } = req
	const message = newMessage(req.body, context)

	res.statusCode = 201
	res.json({ result: "ok", data: message })
}

const readMessages = (req: NextApiRequestWithContext, res: NextApiResponse) => {
	const { context } = req
	const { room, pwd } = req.query
	const found = findOneByProps(context.rooms, { id: room, pwd })
	if (!findOneByProps(context.rooms, { id: room, pwd })) {
		error({ status: 400, message: "room not found" })(res)
		return
	}
	const data = findByProps(context.messages, { room })
	res.statusCode = 200
	res.json({ result: true, data })
}

const MessagesAPI = (req: NextApiRequestWithContext, res: NextApiResponse) => {
	switch (req.method) {
		case "GET":
			readMessages(req, res)
			break;
		case "POST":
			createMessage(req)(res)
			break;
	}
}
export default MessagesAPI