import { NextApiRequest, NextApiResponse } from 'next'
import firebase, { firestore } from "../../../libs/Firebase"

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
	const { room, pwd, name, team } = req.query
	try {
		const roomRef = firestore.doc(`rooms/${room}`)
		const roomData = (await roomRef.get())?.data() as Room
		if (!roomData) {
			return error(res, 400, "room not exist")
		}
		if (roomData.userPassword !== pwd) {
			return error(res, 401, "wrong password")
		}
		const teamRef = firestore.doc(`rooms/${room}/teams/${team}`)
		const teamDoc = await teamRef.get()
		if (!teamDoc.exists) {
			return error(res, 400, "team not exist")
		}
		const user = {
			name,
			team
		}
		const userRef = await roomRef.collection("users").add({
			...user,
			createdAt: firebase.firestore.FieldValue.serverTimestamp()
		})
		const tokenRef = await roomRef.collection("tokens").add({
			user: userRef.id,
			createdAt: firebase.firestore.FieldValue.serverTimestamp()
		})
		return success(res, 201, {
			message: "user created",
			token: tokenRef.id,
			data: { user: { id: userRef.id, ...user } }
		})
	}
	catch (err) {
		error(res, 500, "something is wrong; code: signup-001")
	}
}