import socketIO from "socket.io"
import Color from "color"

export type IdType = string;

export interface ServerContext {
	io: socketIO.Server,
	rooms: Room[],
	teams: Team[],
	users: User[],
	messages: Message[],
}

export interface Room {
	id: IdType,
	name: string,
	pwd: string,
}

export interface Team {
	id: IdType,
	name: string,
	color: Color,
	room: IdType,
}

export interface User {
	id: IdType,
	name: string,
}

export interface Message {
	id: IdType,
	text: string,
	timestamp: number // Unix Epoch Time
	room: IdType,
	team: IdType,
	user: IdType,
}


