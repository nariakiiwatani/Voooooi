import { NextApiRequest, NextApiResponse } from 'next'
import { ServerContext } from '../../libs/Models'
import { findOneByProps, findByProps } from '../../libs/Utils'

type NextApiRequestWithContext = NextApiRequest & {
	context: ServerContext
}
const error = ({ status, message }) => (res: NextApiResponse) => {
	res.statusCode = status
	res.json({ error: message })
}

const readTeams = (req: NextApiRequestWithContext, res: NextApiResponse) => {
	const { context } = req
	const { room, pwd } = req.query
	const found = findOneByProps(context.rooms, { id: room, pwd })
	if (!findOneByProps(context.rooms, { id: room, pwd })) {
		error({ status: 400, message: "room not found" })(res)
		return
	}
	const teams = findByProps(context.teams, { room })
	res.statusCode = 200
	res.json({ result: true, data: teams })
}

const TeamsAPI = (req: NextApiRequestWithContext, res: NextApiResponse) => {
	switch (req.method) {
		case "GET":
			readTeams(req, res)
			break;
	}
}
export default TeamsAPI