import { NextApiRequest, NextApiResponse } from 'next'
import { firestore } from "../../../libs/Firebase"

const success = (res: NextApiResponse, status: number, data: {}) => {
	res.status(status).json(data)
}
const error = (res: NextApiResponse, status: number, message: string) => {
	res.status(status).json({ error: message })
}
type Room = {
	userPassword: string,
	adminPassword: string
}
export default async (req: NextApiRequest, res: NextApiResponse) => {
	const { name, pwd, token } = req.query
	try {
		const roomRef = firestore.doc(`rooms/${name}`)
		const room = (await roomRef.get())?.data() as Room
		if (!room) {
			return error(res, 400, "room not exist")
		}
		if (token !== undefined) {
			const tokenRef = firestore.doc(`rooms/${name}/tokens/${token}`);
			if (!(await tokenRef.get()).exists) {
				return error(res, 401, "wrong token")
			}
		}
		else if (room.userPassword !== pwd) {
			return error(res, 401, "wrong password")
		}
		delete room.userPassword
		delete room.adminPassword
		return success(res, 200, {
			message: "success",
			data: {
				room: {
					id: roomRef.id,
					...room
				}
			}
		})
	}
	catch (err) {
		error(res, 500, "something is wrong; code: rooms-001")
	}
}