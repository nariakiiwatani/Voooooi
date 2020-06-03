import { NextApiRequest, NextApiResponse } from 'next'
import { ServerContext, Room } from '../../libs/Models'
import { firstOf, findOneByProps, findByProps } from '../../libs/Utils'
import { newDefaultRoom } from '../../libs/Factory'
import { findRoomByName } from "../../libs/Firebase"
import { resolve } from 'dns'

type NextApiRequestWithContext = NextApiRequest & {
	context: ServerContext
}

const error = ({ status, message }) => (res: NextApiResponse) => {
	res.statusCode = status
	res.json({ error: message })
}

const createRoom = (req: NextApiRequestWithContext) => async (res: NextApiResponse) => {
	const { name, pwd } = req.body

	const found = await findRoomByName({ name, pwd })

	if (found && found.length > 0) {
		return error({ status: 400, message: `room:${name} already exists` })(res)
	}
	const room: Room = await newDefaultRoom(name, pwd)

	const data = { ...room }
	delete data.pwd

	res.statusCode = 201
	res.json({ result: "ok", data })
}

const readRoom = (req: NextApiRequestWithContext) => async (res: NextApiResponse) => {
	const name = firstOf(req.query.name)
	const pwd = firstOf(req.query.pwd)
	if (!name || !pwd) {
		return error({ status: 400, message: `please contain 'name' and 'pwd' parameter in query.` })(res)
	}
	const room = await findRoomByName({ name, pwd })
	console.info(room)
	if (!room || room.length === 0) {
		return error({ status: 400, message: `room:${name} not exists` })(res)
	}
	const data = { ...room[0] }
	delete data.pwd

	const params = (firstOf(req.query.params) || "").split(",").filter(v => v !== "")
	params.forEach(p => {
		data[p] = findByProps(req.context[p], { room: data.id })
	})

	res.statusCode = 200
	res.json({ result: true, data })
}

const RoomsAPI = (req: NextApiRequestWithContext, res: NextApiResponse) => {
	return new Promise(async resolve => {
		switch (req.method) {
			case "GET":
				await readRoom(req)(res)
				break;
			case "POST":
				await createRoom(req)(res)
				break;
		}
		return resolve()
	})
}
export default RoomsAPI