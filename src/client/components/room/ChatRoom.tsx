import { useState, useEffect, useContext, useRef, Suspense } from 'react'
import VoextInput from './VoextInput'
import CommentList from './CommentList'
import { UserContext } from '../contexts/UserContext'
import { Grid, Paper, Box } from '@material-ui/core'
import { useCollection, useFuegoContext } from '@nandorojo/swr-firestore'

const ChatRoom = props => {
	const { roomId } = props
	const user = useContext(UserContext)
	const teams = useCollection(`rooms/${roomId}/teams`)
	const { fuego } = useFuegoContext()

	const makeMessage = text => ({
		room: roomId,
		user: user.user.id,
		team: user.team.id,
		text
	})

	const handleSubmit = text => {
		fuego.db.collection(`rooms/${roomId}/messages`).add({
			...makeMessage(text)
		})
			.catch(e => { console.error(e) })

	}

	return (
		<>
			<VoextInput
				onSubmit={handleSubmit}
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
				<Suspense fallback={<div>チーム情報取得中</div>}>
					{teams.data.map(t => {
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
								<CommentList roomId={roomId} team={t} />
							</Grid>
						)
					})}
				</Suspense>
			</Grid>
		</>
	)
}

export default ChatRoom