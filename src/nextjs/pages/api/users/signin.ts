import { NextApiRequest, NextApiResponse } from 'next'
import { firestore } from "../../../libs/Firebase"

const success = (res: NextApiResponse, status: number, data: {}) => {
	res.status(status).json(data)
}
const error = (res: NextApiResponse, status: number, message: string) => {
	res.status(status).json({ error: message })
}
type Token = {
	user: string
}
export default async (req: NextApiRequest, res: NextApiResponse) => {
	const { room, token } = req.query
	try {
		const tokenDoc = await firestore.doc(`rooms/${room}/tokens/${token}`).get()
		if (!tokenDoc.exists) {
			return error(res, 400, "room or token not exist")
		}
		const tokenData = tokenDoc.data() as Token
		const userRef = await firestore.doc(`rooms/${room}/users/${tokenData.user}`).get()
		if (!userRef.exists) {
			return error(res, 400, "user not exist")
		}
		const user = userRef.data()
		return success(res, 200, {
			message: "login successful",
			data: { user }
		})
	}
	catch (err) {
		error(res, 500, "something is wrong; code: signin-001")
	}
}