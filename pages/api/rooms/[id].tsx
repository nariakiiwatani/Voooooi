
const error = ({ status, message }) => res => {
	res.status = status
	res.json({ error: message })
}


const createRoom = req => res => {
	const { rooms } = req.context
	const { id } = req.query
	if (id in rooms) {
		return error({ status: 400, message: `room:${id} already exists` })(res)
	}
	rooms[id] = { id }
	res.status = 201
	res.json({ result: `room:${id} successfully created.` })
}
const readRoom = req => res => {
	error({ status: 501, message: "read room is not implemented yet" })(res)
}
const updateRoom = req => res => {
	error({ status: 501, message: "update room is not implemented yet" })(res)
}
const deleteRoom = req => res => {
	error({ status: 501, message: "delete room is not implemented yet" })(res)
}

const RoomAPI = (req: Request, res: Response) => {
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