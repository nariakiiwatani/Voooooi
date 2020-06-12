import { useContext, useState } from 'react'
import VoextInput from './VoextInput'
import CommentList from './CommentList'
import { UserContext } from '../contexts/UserContext'
import { Grid } from '@material-ui/core'
import { fuego, useCollection, useDocument } from '@nandorojo/swr-firestore'
import * as firebase from "firebase"

const ChatRoom = props => {
	const { room } = props
	const context = useContext(UserContext)
	const teams = useCollection(`rooms/${room.id}/teams`)
	const isTeamsValid = () => (teams && teams.data && teams.data.length)
	const { data: viewSettings } = useDocument<{
		combinedTimeline: boolean
	}>(`rooms/${room.id}/settings/view`, { listen: true })

	const makeMessage = text => ({
		room: room.id,
		user: context.user.get(),
		team: context.team.get(),
		text
	})

	const handleSubmit = text => {
		if (!text || text === "") return
		fuego.db.collection(`rooms/${room.id}/messages`).add({
			...makeMessage(text),
			createdAt: firebase.firestore.FieldValue.serverTimestamp()
		})
			.catch(e => { console.error(e) })

	}

	if (!viewSettings) {
		return <></>
	}

	return (
		<>
			<VoextInput
				onSubmit={handleSubmit}
				style={{
					flexShrink: 0
				}}
			/>
			{isTeamsValid() &&

				(viewSettings.combinedTimeline ? (
					<CommentList room={room} teams={teams.data} />
				) : (
						<Grid container
							spacing={2}
							style={{
								flexGrow: 1,
								display: "flex",
								flexDirection: "column",
								minHeight: 0,
							}}
						>
							{teams.data.map(t => (
								<Grid item
									xs={3}
									key={t.id}
									style={{
										flexGrow: 1,
										minHeight: "100%",
									}}
								>
									<CommentList room={room} team={t} />
								</Grid>
							)
							)}
						</Grid>
					)
				)
			}
		</>
	)
}

export default ChatRoom