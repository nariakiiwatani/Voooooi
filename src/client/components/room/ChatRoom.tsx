import { useState, useEffect, useContext, useRef } from 'react'
import VoextInput from './VoextInput'
import CommentList from './CommentList'
import { UserContext } from '../contexts/UserContext'
import { Grid, Paper, Box } from '@material-ui/core'
import { useCollection } from '@nandorojo/swr-firestore'

const ChatRoom = props => {
	const { roomId } = props
	const user = useContext(UserContext)
	const teams = useCollection(`rooms/${roomId}/teams`)
	const messages = useCollection(`rooms/${roomId}/messages`)

	const makeMessage = text => ({
		room: roomId,
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