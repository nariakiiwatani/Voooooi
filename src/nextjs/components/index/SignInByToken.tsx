import { useState, useContext } from 'react'
import { Select, makeStyles, createStyles, MenuItem, FormControl, InputLabel, Button } from '@material-ui/core'
import { makeQueryString } from '../../libs/Utils'
import Router from 'next/router'
import { UserContext } from '../contexts/UserContext'
import { useLocalStorage } from 'react-use'

const useStyle = makeStyles(theme => createStyles({
	lowAttentionButton: {
		textTransform: "none"
	}
}))

export default props => {
	const [tokens, setTokens] = useLocalStorage<{ [room: string]: { [token: string]: any } }>("tokens", null)

	const [room, setRoom] = useState(props.room || Object.keys(tokens)[0])
	const [token, setToken] = useState(Object.keys(tokens[room])[0])
	const context = useContext(UserContext)

	const [error, setError] = useState("")

	const handleRoomSelect = roomName => {
		setRoom(roomName)
		setToken(Object.keys(tokens[roomName])[0])
	}
	const handleSubmit = async e => {
		e.preventDefault()
		setError("")
		const response = await fetch(`/api/users/signin?${makeQueryString({ room, token })}`)
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
		<form onSubmit={handleSubmit}>
			<FormControl fullWidth>
				<InputLabel id="id-token-select-room">部屋</InputLabel>
				<Select
					labelId="id-token-select-room"
					id="token-select-room"
					value={room}
					onChange={e => { handleRoomSelect(e.target.value as string) }}
				>
					{Object.entries(tokens).filter(([k, v]) => Object.keys(v).length).map(([k, v]) => (
						<MenuItem
							key={k}
							className={classes.lowAttentionButton}
							value={k}
						>
							{k}
						</MenuItem>
					))}
				</Select>
			</FormControl>
			{tokens[room] ?
				<FormControl fullWidth>
					<InputLabel id="id-token-select-user">選手名</InputLabel>
					<Select
						labelId="id-token-select-user"
						id="token-select-user"
						value={token}
						onChange={e => { setToken(e.target.value as string) }}
					>
						{Object.entries(tokens[room]).map(([token, user]) => (
							<MenuItem
								key={token}
								className={classes.lowAttentionButton}
								value={token}
							>
								{user.name}
							</MenuItem>
						))}
					</Select>
				</FormControl>
				: <></>}
			<Button
				fullWidth
				type="submit"
				variant="contained"
				color="primary"
				disabled={token === ""}
			>
				入室
				</Button>
			<div>{error}</div>
		</form>
	)
}