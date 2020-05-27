import { User, Room, Team, Message, IdType, ServerContext } from "./Models"
import Color from "color"
import crypto from "crypto"

const newId = (() => seed => {
	let id = ""
	return (() => id = crypto.createHash('sha1').update(id + seed).digest('hex'))()
})()

export function newUser(user: {
	name: string,
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

export function newTeam(team: {
	name: string,
	color: Color,
	room: IdType,
}, context?: ServerContext): Team {
	const ret: Team = {
		id: newId(team.name),
		...team
	}
	if (context) context.teams.push(ret)
	return ret
}

export function newRoom(room: {
	name: string,
	pwd: string,
}, context?: ServerContext): Room {
	const ret: Room = {
		id: newId(room.name),
		...room
	}
	if (context) context.rooms.push(ret)
	return ret
}

const makeDefaultRoom = (params: {
	name: string,
	pwd: string
}, context?: ServerContext): Room => {
	const room = newRoom(params, context);
	[{
		name: "red",
		color: new Color("rgb(255,0,0)"),
	}, {
		name: "blue",
		color: new Color("rgb(0,0,255)"),
	}, {
		name: "yellow",
		color: new Color("rgb(255,255,0)"),
	}, {
		name: "white",
		color: new Color("rgb(128,128,128)"),
	},
	].forEach((team => {
		newTeam({
			room: room.id,
			...team
		}, context)
	}))
	return room
}
export function newDefaultRoom(name: string, pwd: string, context?: ServerContext): Room {
	return makeDefaultRoom({ name, pwd }, context)
}

