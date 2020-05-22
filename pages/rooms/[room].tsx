import { useState, useEffect } from "react"
import VoextInput from '../../components/VoextInput'
import CommentList from '../../components/CommentList'
import io from "socket.io-client"
import { Message } from '../../libs/Models'

const Room = (props) => {
	const { roomId, userName, teamName } = props
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
			const result = await fetch(`/api/rooms/${roomId}?${query}`)
			if (result.status !== 200) {
				console.log("チーム一覧の取得に失敗", await result.json())
				return;
			}
			const { teams, messages } = (await result.json()).data
			const comments: Map<string, Message[]> = Object.values(teams).reduce((acc, { name }) => { acc[name] = []; return acc }, new Map<string, Message[]>())
			messages.forEach(m => {
				comments[m.teamName].push(m)
			})
			setTeamComments(comments)
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
			roomId: params.room,
			userName: query.userName,
			teamName: query.teamName,
		},
	}
}
export default Room