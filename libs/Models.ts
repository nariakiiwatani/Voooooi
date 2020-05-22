import socketIO from 'socket.io'
import Color from "color"

export interface ServerContext {
	io: socketIO.Server,
	rooms: { [id: string]: Room }
}

export interface Room {
	name: string,
	teams: { [id: string]: Team }
	messages: Message[]
}
export const defaultRoom = name => {
	return {
		name,
		teams: defaultTeams,
		messages: []
	}
}

export interface Team {
	name: string,
	color: Color
}

export interface User {
	name: string
}

export interface Message {
	timestamp: number // Unix Epoch Time
	text: string,
	roomId: string,
	teamName: string
	userName: string,
}

export const defaultTeams: { [id: string]: Team } = {
	"red": {
		name: "red",
		color: new Color("red")
	},
	"blue": {
		name: "blue",
		color: new Color("blue")
	},
	"yellow": {
		name: "yellow",
		color: new Color("yellow")
	},
	"white": {
		name: "white",
		color: new Color("gray")
	},
}

