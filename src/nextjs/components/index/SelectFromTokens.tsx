import { useState } from 'react'
import { Select, makeStyles, createStyles, MenuItem, FormControl, InputLabel, Button } from '@material-ui/core'

const useStyle = makeStyles(theme => createStyles({
	lowAttentionButton: {
		textTransform: "none"
	}
}))

export default props => {
	const { tokens, onSubmit }: {
		tokens: { [room: string]: { token: string, user: { id: string, name: string, team: string } }[] },
		onSubmit: ({ room, token }: { room: string, token: string }) => void
	} = props
	const [room, setRoom] = useState("")
	const [user, setUser] = useState("")
	const handleRoomSelect = roomName => {
		setRoom(roomName)
		setUser(tokens[roomName][0].user.id)
	}
	const handleSubmit = e => {
		e.preventDefault()
		onSubmit({
			room,
			token: tokens[room].find(token => token.user.id === user).token
		})
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
					{Object.entries(tokens).filter(([k, v]) => v?.length).map(([k, v]) => (
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
						value={user}
						onChange={e => { setUser(e.target.value as string) }}
					>
						{tokens[room].map(({ token, user }) => (
							<MenuItem
								key={token}
								className={classes.lowAttentionButton}
								value={user.id}
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
				disabled={user === ""}
			>
				入室
				</Button>
		</form>
	)
}