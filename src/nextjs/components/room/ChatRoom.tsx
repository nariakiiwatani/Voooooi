import { useContext } from 'react'
import VoextInput from './VoextInput'
import CommentList from './CommentList'
import { UserContext } from '../contexts/UserContext'
import { Grid } from '@material-ui/core'
import { fuego, useCollection } from '@nandorojo/swr-firestore'
import * as firebase from "firebase"

const ChatRoom = props => {
	const { roomId } = props
	const user = useContext(UserContext)
	const teams = useCollection(`rooms/${roomId}/teams`)
	const isTeamsValid = () => (teams && teams.data && teams.data.length)

	const makeMessage = text => ({
		room: roomId,
		user: user.user.id,
		team: user.team.id,
		text
	})

	const handleSubmit = text => {
		if (!text || text === "") return
		fuego.db.collection(`rooms/${roomId}/messages`).add({
			...makeMessage(text),
			createdAt: firebase.firestore.FieldValue.serverTimestamp()
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
				{isTeamsValid() && teams.data.map(t => {
					return (
						<Grid item
							xs={3}
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
			</Grid>
		</>
	)
}

export default ChatRoom