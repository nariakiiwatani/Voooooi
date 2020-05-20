import { useState, useEffect } from "react"
import VoextInput from '../../components/VoextInput'
import History from '../../components/History'
import io from "socket.io-client"

const Room = (props) => {
	const { roomId, username, userteam } = props
	const [history, setHistory] = useState({
		lastId: 0,
		messages: []
	})
	const [socket, setSocket] = useState(null)
	useEffect(() => {
		setSocket(io())
	}, [])

	const debugInfo = () => (
		<div>
			<div>Room:{roomId}</div>
			<div>username:{username}</div>
			<div>userteam:{userteam}</div>
		</div>
	)
	const onVoextSubmit = (text) => {
		const messages = history.messages.slice()
		messages.push({ id: history.lastId, text })
		setHistory({
			lastId: history.lastId + 1,
			messages
		})
		socket.emit("message", text)
	}

	return (
		<div>
			{debugInfo()}
			{<VoextInput onSubmit={onVoextSubmit} />}
			{<History messages={history.messages} />}
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