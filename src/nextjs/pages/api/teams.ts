import { NextApiRequest, NextApiResponse } from 'next'
import { firestore } from "../../libs/Firebase"

const success = (res: NextApiResponse, status: number, data: {}) => {
	res.status(status).json(data)
}
const error = (res: NextApiResponse, status: number, message: string) => {
	res.status(status).json({ error: message })
}
type Room = {
	userPassword: string
}
export default async (req: NextApiRequest, res: NextApiResponse) => {
	const { room, pwd } = req.query
	try {
		const roomRef = firestore.doc(`rooms/${room}`)
		const roomData = (await roomRef.get())?.data() as Room
		if (!roomData) {
			return error(res, 400, "room not exist")
		}
		if (roomData.userPassword !== pwd) {
			return error(res, 401, "wrong password")
		}
		const teamsRef = firestore.collection(`rooms/${room}/teams`).orderBy("createdAt", "asc")
		const teams = [];
		(await teamsRef.get()).forEach(doc => {
			teams.push({ id: doc.id, ...doc.data() })
		})
		return success(res, 200, {
			message: "success",
			data: { teams }
		})
	}
	catch (err) {
		error(res, 500, "something is wrong; code: teams-001")
	}
}