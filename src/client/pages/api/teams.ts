import { NextApiRequest, NextApiResponse } from 'next'
import { ServerContext } from '../../libs/Models'
import { findOneByProps, findByProps } from '../../libs/Utils'
import { getTeamsByRoomId } from "../../libs/Firebase"

type NextApiRequestWithContext = NextApiRequest & {
	context: ServerContext
}
const error = ({ status, message }) => (res: NextApiResponse) => {
	res.statusCode = status
	res.json({ error: message })
}

const readTeams = (req: NextApiRequestWithContext) => async (res: NextApiResponse) => {
	const { room, pwd } = req.query
	const found = await getTeamsByRoomId({ id: room, pwd })
	if (!found) {
		error({ status: 400, message: "room not found" })(res)
		return
	}
	res.statusCode = 200
	res.json({ result: true, data: found })
}

const TeamsAPI = (req: NextApiRequestWithContext, res: NextApiResponse) => {
	switch (req.method) {
		case "GET":
			readTeams(req)(res)
			break;
	}
}
export default TeamsAPI