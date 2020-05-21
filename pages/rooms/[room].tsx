import { useState, useEffect } from "react"
import VoextInput from '../../components/VoextInput'
import CommentList from '../../components/CommentList'
import io from "socket.io-client"

const Room = (props) => {
	const { roomId, userName, teamName } = props
	const [commentList, setCommentList] = useState({
		lastId: 0,
		messages: []
	})
	const [myComments, setMyComments] = useState([])
	const [socket, setSocket] = useState(() => io())

	useEffect(() => {
		socket.on("message", onReceiveMessage)
		socket.emit("join", roomId)
		return () => {
			socket.off("message")
		}
	}, [])

	useEffect(() => {
		const asyncFunc = async () => {
			const query = "params=teams"
			const result = await fetch(`/api/rooms/${roomId}?${query}`)
			if (result.status !== 200) {
				console.log("チーム一覧の取得に失敗", await result.json())
				return;
			}
			console.log("teams:", await result.json())
		}
		asyncFunc();
	}, [])

	const debugInfo = () => (
		<div>
			<div>Room:{roomId}</div>
			<div>username:{userName}</div>
			<div>userteam:{teamName}</div>
		</div>
	)
	const makeMessage = text => ({
		roomId, userName, teamName, text
	})
	const onReceiveMessage = message => {
		setCommentList(({ lastId, messages }) => ({
			lastId: lastId + 1,
			messages: [...messages, { id: lastId, ...message }]
		}))
	}
	const onVoextSubmit = (text) => {
		setMyComments([...myComments, makeMessage(text)])
		socket.emit("message", makeMessage(text))
	}

	return (
		<div>
			{debugInfo()}
			{<VoextInput onSubmit={onVoextSubmit} />}
			<p>自分の</p>
			{<CommentList messages={myComments} />}
			<p>部屋の</p>
			{<CommentList messages={commentList.messages} />}
		</div>
	)
}

export const getServerSideProps = async ({ params, query }) => {
	return {
		props: {
			roomId: params.room,
			userName: query.userName,
			teamName: query.teamName,
		},
	}
}
export default Room