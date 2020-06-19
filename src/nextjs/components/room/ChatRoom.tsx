import { useContext, useState, useMemo, useEffect } from 'react'
import VoextInput from './VoextInput'
import CommentList from './CommentList'
import { UserContext } from '../contexts/UserContext'
import { Grid, createStyles, Theme, makeStyles } from '@material-ui/core'
import { useCollection, useDocument, fuego } from '@nandorojo/swr-firestore'
import * as firebase from "firebase"

const useStyle = makeStyles((theme: Theme) => createStyles({
	root: {
		flexGrow: 1,
		display: "flex",
		flexDirection: "column",
		minHeight: 0,
	},
	voextInput: {
	},
	messageColumns: {
		minHeight: 0,
	},
	messageColumn: {
		height: "100%",
	}
}))

const ChatRoom = (props: { room: { id: string } }) => {
	const { room } = props
	const context = useContext(UserContext)
	const teams = useCollection(`rooms/${room.id}/teams`,
		{
			orderBy: ["createdAt", "asc"]
		}
	)
	const users = useCollection(`rooms/${room.id}/users`)
	const messages = useCollection(`rooms/${room.id}/messages`,
		{
			orderBy: ["createdAt", "asc"],
			listen: true
		}
	)
	const isTeamsValid = () => (teams && teams.data && teams.data.length)
	const { data: viewSettings } = useDocument<{
		combinedTimeline: boolean,
		muteOtherTeams: boolean
	}>(`rooms/${room.id}/settings/view`, { listen: true })
	const { data: rights } = useDocument<{
		allowPost: boolean
	}>(`rooms/${room.id}/settings/rights`, { listen: true })

	const teamsColumn = useMemo(() => {
		if (teams?.data?.length === 0 || !viewSettings) return []
		return viewSettings.muteOtherTeams ?
			teams.data.filter(t => t.id === context.team.get())
			: teams.data
	}, [teams.data, viewSettings])
	const dispTeams = useMemo(() => {
		return [...teamsColumn, teams.data?.find(t => t.id === "admin")]
	}, [teamsColumn])

	const classes = useStyle()
	const makeMessage = (text: string) => ({
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
		<div className={classes.root}>
			<VoextInput
				onSubmit={handleSubmit}
				enabled={rights?.allowPost}
				className={classes.voextInput}
			/>
			{isTeamsValid() &&
				(viewSettings.combinedTimeline ? (
					<CommentList room={room} teams={dispTeams} users={users.data} messages={messages.data} />
				) : (
						<Grid container
							spacing={2}
							direction="row"
							className={classes.messageColumns}
						>
							{teamsColumn.filter(t => t.id !== "admin").map(t => (
								<Grid item
									key={t.id}
									xs={true}
									className={classes.messageColumn}
								>
									<CommentList room={room} teams={[t, teams.data.find(t => t.id === "admin")]} users={users.data} messages={messages.data} />
								</Grid>
							)
							)}
						</Grid>
					)
				)
			}
		</div>
	)
}

export default ChatRoom