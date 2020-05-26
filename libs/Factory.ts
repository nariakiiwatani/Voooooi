import { User, Room, Team, Message, IdType } from "./Models"
import Color from "color"
import crypto from "crypto"
import { context } from "../server/index"

const newId = (() => seed => {
	let id = ""
	return (() => id = crypto.createHash('sha1').update(id + seed).digest('hex'))()
})()

export function newUser(user: {
	name: string,
	room: IdType,
	team: IdType,
}): User {
	const ret: User = {
		id: newId(user.name),
		...user
	}
	context.users.push(ret)
	return ret
}

export function newMessage(message: {
	text: string,
	timestamp?: number,
	room: IdType,
	team: IdType,
	user: IdType
}): Message {
	const ret: Message = {
		id: newId(message.timestamp),
		timestamp: message.timestamp || new Date().getTime(),
		...message
	}
	context.messages.push(ret)
	return ret
}

export function newTeam(team: {
	name: string,
	color: Color,
	room: IdType,
}): Team {
	const ret: Team = {
		id: newId(team.name),
		...team
	}
	context.teams.push(ret)
	return ret
}

export function newRoom(room: {
	name: string,
}): Room {
	const ret: Room = {
		id: newId(room.name),
		...room
	}
	context.rooms.push(ret)
	return ret
}

const makeDefaultRoom = (name): Room => {
	const room = newRoom(name);
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
		})
	}))
	return room
}
export function newDefaultRoom(name: string): Room {
	return makeDefaultRoom(name)
}

