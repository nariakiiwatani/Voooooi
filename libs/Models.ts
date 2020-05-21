import socketIO from 'socket.io'

export type ServerContext = {
	io: socketIO.Server,
	rooms: { [id: string]: Room }
}

export type Room = {
	id: string
}
