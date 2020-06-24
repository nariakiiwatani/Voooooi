import { Button, ListItemIcon, makeStyles, createStyles, Select, MenuItem, TextField } from '@material-ui/core'
import { People } from '@material-ui/icons'
import { useState, useContext } from 'react'
import { makeQueryString } from '../../libs/Utils'
import Router from 'next/router'
import { UserContext } from '../contexts/UserContext'
import { useLocalStorage } from 'react-use'

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
export default (props: {
	room: string,
	pwd: string,
	teams: { id: string, name: string, color: number[] }[],
}) => {
	const { room, pwd, teams } = props
	const [error, setError] = useState("")
	const context = useContext(UserContext)
	const [tokens, setTokens] = useLocalStorage<{ [room: string]: { [token: string]: any } }>("tokens", null)
	const [name, setName] = useState("")
	const [team, setTeam] = useState(teams.length && teams[0].id)
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
					required
					onChange={e => { setName(e.target.value) }}
				/>
				<Select
					fullWidth
					value={team}
					onChange={e => { setTeam(e.target.value as string) }}
					required
				>
					{teams.filter(t => t.id !== "admin").map((t, i) => {
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