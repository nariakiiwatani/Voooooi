import { useState, useEffect } from "react"
import VoextInput from '../../components/VoextInput'
import CommentList from '../../components/CommentList'
import io from "socket.io-client"
import { Message } from '../../libs/Models'
import { objectToArray } from '../../libs/Utils'

const Room = (props) => {
	const { roomId, roomName, userName, teamName } = props
	const [myComments, setMyComments] = useState([])
	const [teamComments, setTeamComments] = useState(new Map<string, Message[]>())
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
			const query = "params=teams,messages"
			const response = await fetch(`/api/rooms/${roomName}?${query}`)
			if (response.status !== 200) {
				console.log("チーム一覧の取得に失敗", await response.json())
				return;
			}
			const result = (await response.json()).data
			console.log("result", result)
			const { teams, messages } = result
			const comments = objectToArray(teams).reduce((acc, { name }) => { acc[name] = []; return acc }, {})
			objectToArray(messages).forEach(m => {
				console.info(m)
				if (Array.isArray(comments[m.teamName])) {
					comments[m.teamName].push(m)
				}
			})
			setTeamComments(comments)
		}
		asyncFunc();
	}, [])

	const debugInfo = () => (
		<div>
			<div>Room:{roomName}</div>
			<div>username:{userName}</div>
			<div>userteam:{teamName}</div>
		</div>
	)
	const makeMessage = text => ({
		roomId, roomName, userName, teamName, text
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

	return (
		<div>
			{debugInfo()}
			{<VoextInput onSubmit={onVoextSubmit} />}
			<p>自分の</p>
			{<CommentList messages={myComments} />}
			{Object.entries(teamComments).map(([k, v]) => (
				<div key={k}>
					<div>{k}の</div>
					<CommentList messages={v} />
				</div>
			))}
		</div>
	)
}

export const getServerSideProps = async ({ params, query }) => {
	return {
		props: {
			roomName: params.room,
			...query
		},
	}
}
export default Room