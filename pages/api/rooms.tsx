const readRooms = (req, res) => {
	res.status = 200
	res.json({ result: true })
}

const RoomsAPI = (req: Request, res: Response) => {
	switch (req.method) {
		case "GET":
			readRooms(req, res)
			break;
	}
}
export default RoomsAPI