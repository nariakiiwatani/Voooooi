import { useContext, useState, useMemo, useEffect } from 'react'
import VoextInput from './VoextInput'
import CommentList from './CommentList'
import { UserContext } from '../contexts/UserContext'
import { Grid, createStyles, Theme, makeStyles, MenuItem, ListItem, ListItemIcon, ListItemText, Collapse, List, Box } from '@material-ui/core'
import { useCollection, useDocument, fuego } from '@nandorojo/swr-firestore'
import { Person, ExitToApp } from "@material-ui/icons"
import * as firebase from "firebase"
import UserMenu from './settings/UserMenu'
import ExitMenu from './settings/ExitMenu'

const useStyle = makeStyles((theme: Theme) => createStyles({
	root: {
		flexGrow: 1,
		minHeight: 0,
	},
	content: {
		height: "100%",
		display: "flex",
		flexDirection: "column"
	},
	drawerOpen: {
		width: "100%",
		transition: theme.transitions.create('width', {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
		}),
		overflowX: 'hidden',
	},
	drawerClose: {
		transition: theme.transitions.create('width', {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		}),
		overflowX: 'hidden',
		width: theme.spacing(7) + 1,
		[theme.breakpoints.up('sm')]: {
			width: theme.spacing(9) + 1,
		},
	},
	voextInput: {
		flexShrink: 0
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
	const myUser = useMemo(() => (
		users.data?.find(u => u.id === context.user?.get())
	), [context.user, users.data])
	const myTeam = useMemo(() => (
		teams.data?.find(t => t.id === context.team?.get())
	), [context.team, teams.data])
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

	const menus = Object.entries({
		user: {
			label: "ユーザー情報",
			icon: <Person />,
			content: <UserMenu
				user={myUser}
				team={myTeam}
			/>
		},
		exit: {
			label: "退室",
			icon: <ExitToApp />,
			content: <ExitMenu />
		}
	}).map(([k, v]) => {
		const [open, setOpen] = useState(false)
		return {
			name: k,
			...v,
			open, setOpen
		}
	})
	const menuOpen = menus.some(m => m.open)

	const listItem = props => {
		const { name, label, icon, content, open, setOpen } = props
		return (
			<Box key={name}>
				<ListItem
					selected={open}
					onClick={() => setOpen(!open)}
				>
					<ListItemIcon>{icon}</ListItemIcon>
					<ListItemText style={{ whiteSpace: "nowrap" }}>{label}</ListItemText>
				</ListItem>
				<Collapse in={open} timeout="auto" unmountOnExit>
					{content}
				</Collapse>
			</Box>
		)
	}

	if (!viewSettings) {
		return <></>
	}

	return (
		<>
			<Grid container
				direction="row"
				className={classes.root}>
				<Grid item
					key="menu"
					xs="auto"
				>
					<List className={menuOpen ? classes.drawerOpen : classes.drawerClose}>
						{menus.map(listItem)}
					</List>
				</Grid>
				<Grid item
					key="chat"
					className={classes.content}
					xs={true}
				>
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
				</Grid>
			</Grid>
		</>
	)
}

export default ChatRoom