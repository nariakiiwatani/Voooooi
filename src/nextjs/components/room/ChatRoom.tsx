import { useContext, useState, useMemo } from 'react'
import VoextInput from './VoextInput'
import CommentList from './CommentList'
import { UserContext } from '../contexts/UserContext'
import { Grid } from '@material-ui/core'
import { fuego, useCollection, useDocument } from '@nandorojo/swr-firestore'
import * as firebase from "firebase"

const ChatRoom = props => {
	const { room } = props
	const context = useContext(UserContext)
	const teams = useCollection(`rooms/${room.id}/teams`,
		{
			orderBy: ["createdAt", "asc"]
		}
	)
	const isTeamsValid = () => (teams && teams.data && teams.data.length)
	const { data: viewSettings } = useDocument<{
		combinedTimeline: boolean,
		muteOtherTeams: boolean
	}>(`rooms/${room.id}/settings/view`, { listen: true })

	const dispTeams = useMemo(() => {
		if (teams?.data?.length === 0 || !viewSettings) return []
		return viewSettings.muteOtherTeams ?
			teams.data.filter(t => t.id === context.team.get())
			: teams.data
	}, [teams.data, viewSettings])

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
					<CommentList room={room} teams={dispTeams} />
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
							{dispTeams.map(t => (
								<Grid item
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