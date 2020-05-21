import socketIO from 'socket.io'
import Color from "color"

export type ServerContext = {
	io: socketIO.Server,
	rooms: { [id: string]: Room }
}

export type Room = {
	name: string,
	teams: { [id: string]: Team }
}

export type Team = {
	name: string,
	color: Color
}

export const defaultTeams: { [id: string]: Team } = {
	"red": {
		name: "red",
		color: Color("red")
	},
	"blue": {
		name: "red",
		color: Color("red")
	},
	"yellow": {
		name: "red",
		color: Color("red")
	},
	"white": {
		name: "white",
		color: Color("gray")
	},
}

