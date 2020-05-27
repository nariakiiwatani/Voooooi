import { NextApiRequest, NextApiResponse } from 'next'
import { ServerContext } from '../../libs/Models'
import { firstOf, findOneByProps } from '../../libs/Utils'
import { newDefaultRoom } from '../../libs/Factory'

type NextApiRequestWithContext = NextApiRequest & {
	context: ServerContext
}

const error = ({ status, message }) => (res: NextApiResponse) => {
	res.statusCode = status
	res.json({ error: message })
}

const createRoom = (req: NextApiRequestWithContext) => (res: NextApiResponse) => {
	const { context } = req
	const { name, pwd } = req.body
	const found = findOneByProps(context.rooms, { name })
	if (found) {
		return error({ status: 400, message: `room:${name} already exists` })(res)
	}
	const room = newDefaultRoom(name, pwd, context)

	res.statusCode = 201
	res.json({ result: "ok", data: room })
}

const readRoom = (req: NextApiRequestWithContext) => (res: NextApiResponse) => {
	const name = firstOf(req.query.name)
	const pwd = firstOf(req.query.pwd)
	if (!name || !pwd) {
		return error({ status: 400, message: `please contain 'name' and 'pwd' parameter in query.` })(res)
	}
	const { context } = req
	const data = findOneByProps(context.rooms, { name })
	if (!data) {
		return error({ status: 400, message: `room:${name} not exists` })(res)
	}
	res.statusCode = 200
	res.json({ result: true, data })
}

const RoomsAPI = (req: NextApiRequestWithContext, res: NextApiResponse) => {
	switch (req.method) {
		case "GET":
			readRoom(req)(res)
			break;
		case "POST":
			createRoom(req)(res)
			break;
	}
}
export default RoomsAPI