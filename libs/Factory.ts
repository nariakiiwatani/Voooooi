import { Room, Team, Message } from "./Models"
import Color from "color"
import crypto from "crypto"

const newId = (() => seed => {
	let id = ""
	return (() => id = crypto.createHash('sha1').update(id + seed).digest('hex'))()
})()

export function newMessage(message: Message): [string, Message] {
	return [newId(message.timestamp), message]
}

export function newTeam(name: string, color: Color): [string, Team] {
	return [newId(name), { name, color }]
}

const defaultRoom = (name): Room => {
	const ret: Room = {
		name,
		teams: new Map<string, Team>(),
		messages: new Map<string, Message>()
	};
	["red", "blue", "yellow", "white"].forEach(name => {
		const [id, team] = newTeam(name, new Color(name))
		ret.teams[id] = team
	})
	return ret
}
export function newRoom(room: Room): [string, Room] {
	return [newId(room.name), room]
}
export function newDefaultRoom(name: string): [string, Room] {
	return newRoom(defaultRoom(name))
}

