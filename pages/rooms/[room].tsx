import { useState, useEffect } from "react"
import VoextInput from '../../components/VoextInput'
import CommentList from '../../components/CommentList'
import io from "socket.io-client"
import { Message } from '../../libs/Models'
import { objectToArray } from '../../libs/Utils'

const Room = (props) => {
	const { roomName, pwd } = props
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
		<div className="wrapper">
			<div className="self">
				{debugInfo()}
				{<VoextInput onSubmit={onVoextSubmit} />}
				{<CommentList title="self" messages={myComments} color={teamName} />}
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

export const getServerSideProps = async ({ params, query }) => {
	return {
		props: {
			roomName: params.room,
			...query
		},
	}
}
export default Room