import { Button, ListItemIcon, makeStyles, createStyles, Select, MenuItem, TextField, FormControl, InputLabel } from '@material-ui/core'
import { People } from '@material-ui/icons'
import { useState, useContext } from 'react'
import { makeQueryString } from '../../libs/Utils'
import Router from 'next/router'
import { UserContext } from '../contexts/UserContext'
import { useLocalStorage } from 'react-use'
import useSWR from 'swr'

const useStyle = makeStyles(theme => createStyles({
	lowAttentionButton: {
		textTransform: "none"
	},
	buttonFollowsText: {
		textTransform: "none",
		marginLeft: 12
	},
	popup: {
		padding: theme.spacing(2),
	}
}))

type Team = {
	id: string,
	name: string,
	color: number[]
}
export default (props: {
	room: string,
	pwd: string,
}) => {
	const { room, pwd } = props
	const context = useContext(UserContext)
	const query = context.token.get() !== "" ? { token: context.token.get() } : { pwd }
	const fetcher = url =>
		fetch(`${url}?${makeQueryString({ name: room, ...query })}`)
			.then(r => r.json())
			.then(r => r.data.teams)

	const { data: teams } = useSWR<Team[]>("/api/teams", fetcher, {
		revalidateOnFocus: false
	})
	const [error, setError] = useState("")
	const [tokens, setTokens] = useLocalStorage<{ [room: string]: { [token: string]: any } }>("tokens", null)
	const [name, setName] = useState("")
	const [team, setTeam] = useState("")
	const handleSubmit = async e => {
		e.preventDefault()
		const response = await fetch(`/api/users/signup?${makeQueryString({
			room, pwd, name, team
		})}`)
		if (!response.ok) {
			setError(response.statusText)
			return
		}
		const result = (await response.json()).data
		context.token.set(result.token)
		context.user.set(result.user.id)
		context.team.set(result.user.team)
		setTokens(prev => {
			const thisRooms = { ...(prev[room] || {}) }
			thisRooms[result.token] = result.user
			return {
				...prev,
				[room]: thisRooms
			}
		})
		Router.push(`/rooms/${room}`)
	}

	const classes = useStyle()
	return (
		<>
			<form onSubmit={handleSubmit}>
				<TextField
					fullWidth
					value={name}
					label="選手名"
					required
					onChange={e => { setName(e.target.value) }}
				/>
				<FormControl fullWidth>
					<InputLabel id="id-team-select">チーム</InputLabel>
					<Select
						fullWidth
						labelId="id-team-select"
						id="team-select"
						value={team}
						onChange={e => { setTeam(e.target.value as string) }}
						required
					>
						{teams?.filter(t => t.id !== "admin").map((t, i) => {
							const cssProperty = {
								color: `rgb(${t.color.join(",")})`
							}
							return (
								<MenuItem
									key={i}
									className={classes.lowAttentionButton}
									aria-label={t.name}
									value={t.id}
								>
									<ListItemIcon>
										<People style={cssProperty} />
									</ListItemIcon>
									{t.name}
								</MenuItem>
							)
						})}
					</Select>
				</FormControl>
				<Button
					fullWidth
					type="submit"
					variant="contained"
					color="primary"
				>
					入室
				</Button>
				<div>{error}</div>
			</form>
		</>
	)
}