import { useState, useEffect } from "react"
import VoextInput from '../../components/VoextInput'
import CommentList from '../../components/CommentList'
import io from "socket.io-client"

const Room = (props) => {
	const { roomId, username, userteam } = props
	const [commentList, setCommentList] = useState({
		lastId: 0,
		messages: []
	})
	const [socket, setSocket] = useState(() => io())

	useEffect(() => {
		socket.on("message", onReceiveMessage)
		socket.emit("join", roomId)
		return () => {
			socket.off("message")
		}
	}, [])

	const debugInfo = () => (
		<div>
			<div>Room:{roomId}</div>
			<div>username:{username}</div>
			<div>userteam:{userteam}</div>
		</div>
	)
	const makeMessage = text => ({
		roomId, username, userteam, text
	})
	const onReceiveMessage = message => {
		setCommentList(({ lastId, messages }) => ({
			lastId: lastId + 1,
			messages: [...messages, { id: lastId, ...message }]
		}))
	}
	const onVoextSubmit = (text) => {
		socket.emit("message", makeMessage(text))
	}

	return (
		<div>
			{debugInfo()}
			{<VoextInput onSubmit={onVoextSubmit} />}
			{<CommentList messages={commentList.messages} />}
		</div>
	)
}

export const getServerSideProps = async ({ params, query }) => {
	return {
		props: {
			roomId: params.room,
			username: query.username,
			userteam: query.userteam,
		},
	}
}
export default Room