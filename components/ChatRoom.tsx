import { useState, useEffect, useContext, useRef } from 'react'
import VoextInput from './VoextInput'
import CommentList from './CommentList'
import { UserContext } from './contexts/UserContext'
import io from "socket.io-client"
import { Grid, Paper, Box } from '@material-ui/core'
import { sizing } from '@material-ui/system';

const ChatRoom = props => {
	const { teams, users, messages } = props
	const user = useContext(UserContext)
	const [socket] = useState(() => io())
	const [myComments, setMyComments] = useState(() => messages.filter(m => m.user === user.user.id))
	const [teamComments, setTeamComments] = useState(() => {
		const comments = {}
		teams.forEach(t => { comments[t.id] = [] })
		messages.forEach(m => {
			comments[m.team].push(m)
		})
		return comments
	})
	const inputRef = useRef(null)
	const [inputHeight, setInputHeight] = useState(0)
	useEffect(() => {
		if (inputRef.current) {
			setInputHeight(inputRef.current.clientHeight);
		}
	});

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
		setTeamComments(prev => {
			return ({
				...prev,
				[message.team]: [...prev[message.team], message]
			})
		})
	}
	const onVoextSubmit = (text) => {
		setMyComments(prev => ([...prev, makeMessage(text)]))
		socket.emit("message", makeMessage(text))
	}

	const debugInfo = () => (
		<div>
			<div>Room:{user.room.name}</div>
			<div>RoomID:{user.room.id}</div>
			<div>user:{user.user.name}</div>
			<div>userID:{user.user.id}</div>
			<div>team:{user.team.name}</div>
			<div>teamID:{user.team.id}</div>
		</div>
	)
	return (
		<>
			<VoextInput
				onSubmit={onVoextSubmit}
				style={{
					flexShrink: 0
				}}
			/>
			<Grid container
				spacing={2}
				style={{
					flexGrow: 1,
					display: "flex",
					flexDirection: "column",
					minHeight: 0,
				}}
			>
				{teams.map(t => {
					const c = teamComments[t.id];
					return (
						<Grid item
							xs={3}
							sm={3}
							key={t.id}
							style={{
								flexGrow: 1,
								minHeight: "100%",
							}}
						>
							<CommentList title={`${t.name}のコメント`} messages={c} team={t} users={users} />
						</Grid>
					)
				})}
			</Grid>
		</>
	)
}

export default ChatRoom