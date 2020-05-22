import socketIO from 'socket.io'
import Color from "color"

export interface ServerContext {
	io: socketIO.Server,
	rooms: Map<string, Room>
}

export interface Room {
	name: string,
	teams: Map<string, Team>
	messages: Map<string, Message>
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
	teamId: string
	userName: string,
}


