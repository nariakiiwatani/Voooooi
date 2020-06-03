import { User, Room, Team, Message, IdType, ServerContext } from "./Models"
import Color from "color"
import crypto from "crypto"
import { db, docToRoom, docToTeam } from './Firebase'

const newId = (() => seed => {
	let id = ""
	return (() => id = crypto.createHash('sha1').update(id + seed).digest('hex'))()
})()

export function newUser(user: {
	name: string,
	room: IdType,
	team: IdType,
}, context?: ServerContext): User {
	const ret: User = {
		id: newId(user.name),
		...user
	}
	if (context) context.users.push(ret)
	return ret
}

export function newMessage(message: {
	text: string,
	timestamp?: number,
	room: IdType,
	team: IdType,
	user: IdType
}, context?: ServerContext): Message {
	const ret: Message = {
		id: newId(message.timestamp),
		timestamp: message.timestamp || new Date().getTime(),
		...message
	}
	if (context) context.messages.push(ret)
	return ret
}

export async function newTeam(team: {
	name: string,
	color: Color
}, room: IdType
): Promise<Team> {
	console.info("create team")
	const doc = await db.collection("rooms").doc(room).collection("teams").add({
		...team
	})
	console.info("team", doc)
	return docToTeam(doc)
}

export async function newRoom(room: {
	name: string,
	pwd: string,
}): Promise<Room> {
	console.info("create room")
	const doc = await db.collection("rooms").add({
		...room
	})
	console.info("room", doc)
	return docToRoom(doc)
}

const makeDefaultRoom = async (params: {
	name: string,
	pwd: string
}): Promise<Room> => {
	const room = await newRoom(params);
	[{
		name: "赤チーム",
		color: new Color("rgb(255,0,0)"),
	}, {
		name: "青チーム",
		color: new Color("rgb(0,0,255)"),
	}, {
		name: "黄チーム",
		color: new Color("rgb(255,255,0)"),
	}, {
		name: "白チーム",
		color: new Color("rgb(128,128,128)"),
	},
	].forEach((team => {
		console.info("team", team)

		newTeam({
			...team
		}, room.id,
		)
	}))
	return room
}
export async function newDefaultRoom(name: string, pwd: string): Promise<Room> {
	return await makeDefaultRoom({ name, pwd })
}

