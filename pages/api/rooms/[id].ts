import { NextApiRequest, NextApiResponse } from 'next'
import { ServerContext, defaultRoom } from '../../../libs/Models'
import { firstOf, filterProp } from "../../../libs/Utils"
import { newDefaultRoom } from "../../../libs/Factory"

type NextApiRequestWithContext = NextApiRequest & {
	context: ServerContext
}


const error = ({ status, message }) => (res: NextApiResponse) => {
	res.statusCode = status
	res.json({ error: message })
}

const createRoom = (req: NextApiRequestWithContext) => (res: NextApiResponse) => {
	const { rooms } = req.context
	const name = firstOf(req.query.id)
	if (filterProp(rooms, "name", name).length !== 0) {
		return error({ status: 400, message: `room:${name} already exists` })(res)
	}
	const [newId, room] = newDefaultRoom(name)
	console.log(newId, room)
	rooms[newId] = room

	res.statusCode = 201
	res.json({ result: "ok", data: room })
}
const readRoom = (req: NextApiRequestWithContext) => (res: NextApiResponse) => {
	const { rooms } = req.context
	const name = firstOf(req.query.id)
	const found = filterProp(rooms, "name", name)

	if (found.length === 0) {
		return error({ status: 400, message: `room:${name} not exists` })(res)
	}
	const room = found[0]
	const params = (firstOf(req.query.params) || "").split(",").filter(v => v !== "")
	const data = params.length === 0 ? room : (
		params.reduce((acc, key) => ({ ...acc, [key]: room[key] }), {})
	)

	res.statusCode = 200
	res.json({ result: "ok", data })
}
const updateRoom = (req: NextApiRequestWithContext) => (res: NextApiResponse) => {
	error({ status: 501, message: "update room is not implemented yet" })(res)
}
const deleteRoom = (req: NextApiRequestWithContext) => (res: NextApiResponse) => {
	error({ status: 501, message: "delete room is not implemented yet" })(res)
}

const RoomAPI = (req: NextApiRequestWithContext, res: NextApiResponse) => {
	switch (req.method) {
		case "GET":
			readRoom(req)(res)
			break;
		case "POST":
			createRoom(req)(res)
			break;
		case "UPDATE":
			updateRoom(req)(res)
			break;
		case "DELETE":
			deleteRoom(req)(res)
			break;
	}
}
export default RoomAPI