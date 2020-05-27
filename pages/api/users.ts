import { NextApiRequest, NextApiResponse } from 'next'
import { ServerContext } from '../../libs/Models'
import { findOneByProps, findByProps } from '../../libs/Utils'
import { newUser } from '../../libs/Factory'

type NextApiRequestWithContext = NextApiRequest & {
	context: ServerContext
}
const error = ({ status, message }) => (res: NextApiResponse) => {
	res.statusCode = status
	res.json({ error: message })
}

const createUser = (req: NextApiRequestWithContext) => (res: NextApiResponse) => {
	const { context } = req
	const { name, room, pwd, team } = req.body
	const found = findOneByProps(context.rooms, { id: room, pwd })
	if (!found) {
		return error({ status: 400, message: `room:${name} not found` })(res)
	}
	const data = newUser({ name, room, team }, context)

	res.statusCode = 201
	res.json({ result: "ok", data })
}
const readUsers = (req: NextApiRequestWithContext, res: NextApiResponse) => {
	const { context } = req
	const { room, pwd } = req.query
	const found = findOneByProps(context.rooms, { id: room, pwd })
	if (!findOneByProps(context.rooms, { id: room, pwd })) {
		error({ status: 400, message: "room not found" })(res)
		return
	}
	const data = findByProps(context.users, { room })
	res.statusCode = 200
	res.json({ result: true, data })
}

const UsersAPI = (req: NextApiRequestWithContext, res: NextApiResponse) => {
	switch (req.method) {
		case "GET":
			readUsers(req, res)
			break;
		case "POST":
			createUser(req)(res)
			break;
	}
}
export default UsersAPI