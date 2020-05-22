import { NextApiRequest, NextApiResponse } from 'next'
import { ServerContext, defaultRoom } from '../../../libs/Models'
import { firstOf } from "../../../libs/Utils"

type NextApiRequestWithContext = NextApiRequest & {
	context: ServerContext
}


const error = ({ status, message }) => (res: NextApiResponse) => {
	res.statusCode = status
	res.json({ error: message })
}

const createRoom = (req: NextApiRequestWithContext) => (res: NextApiResponse) => {
	const { rooms } = req.context
	const id = firstOf(req.query.id)
	if (id in rooms) {
		return error({ status: 400, message: `room:${id} already exists` })(res)
	}
	rooms[id] = defaultRoom(id)

	res.statusCode = 201
	res.json({ result: "ok", data: rooms[id] })
}
const readRoom = (req: NextApiRequestWithContext) => (res: NextApiResponse) => {
	const { rooms } = req.context
	const id = firstOf(req.query.id)
	if (!(id in rooms)) {
		return error({ status: 400, message: `room:${id} not exists` })(res)
	}
	const params = (firstOf(req.query.params) || "").split(",").filter(v => v !== "")
	console.log("params", params)
	const data = params.length === 0 ? rooms[id] : (
		params.reduce((acc, key) => ({ ...acc, [key]: rooms[id][key] }), {})
	)
	console.log("data", data)

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