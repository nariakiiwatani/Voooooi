import { useState, useEffect, useContext } from 'react'
import VoextInput from './VoextInput'
import CommentList from './CommentList'
import { UserContext } from './contexts/UserContext'

const ChatRoom = props => {
	const [socket, setSocket] = useState(() => io())
	const [myComments, setMyComments] = useState([])
	const [teamComments, setTeamComments] = useState(new Map<string, Message[]>())
	const user = useContext(UserContext)

	useEffect(() => {
		socket.on("message", onReceiveMessage)
		return () => {
			socket.off("message")
		}
	}, [])
	useEffect(() => {
		socket.emit("join", user.room.id)
		return () => {
			socket.emit("leave", user.room.id)
		}
	}, [user.room.id])

	const makeMessage = text => ({
		room: user.room.id,
		user: user.user.id,
		team: user.team.id,
		text
	})
	const onReceiveMessage = message => {
		console.log(message)
		setTeamComments(prev => {
			return ({
				...prev,
				[message.teamName]: [...prev[message.teamName], message]
			})
		})
	}
	const onVoextSubmit = (text) => {
		setMyComments([...myComments, makeMessage(text)])
		socket.emit("message", makeMessage(text))
	}

	const debugInfo = () => (
		<div>
			<div>Room:{user.room.name}</div>
			<div>RoomID:{user.room.id}</div>
			<div>user:{user.user.id}</div>
			<div>team:{user.team.id}</div>
		</div>
	)
	return (
		<div className="wrapper">
			<div className="self">
				{debugInfo()}
				{<VoextInput onSubmit={onVoextSubmit} />}
				{<CommentList title="self" messages={myComments} color="red" />}
			</div>
			<div className="inRoom">
				{Object.entries(teamComments).map(([k, v]) => (
					<div className={k} key={k}>
						<CommentList title={k} messages={v} color={k} />
					</div>
				))}
			</div>
			<style jsx>{`
			.wrapper {
				display: grid;
				grid-template-columns: 320px 1fr;
				column-gap: 10px;
				row-gap: 10px;
			}
			.inRoom {
				display: grid;
				grid-template-columns: 1fr 1fr;
				grid-template-rows: 1fr 1fr;
				column-gap: 10px;
				row-gap: 10px;
			}
			`}</style>
		</div>
	)
}

export default ChatRoom