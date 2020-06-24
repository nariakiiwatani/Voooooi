import { useState } from 'react'
import { Select, makeStyles, createStyles, MenuItem, FormControl, InputLabel, Button } from '@material-ui/core'

const useStyle = makeStyles(theme => createStyles({
	lowAttentionButton: {
		textTransform: "none"
	}
}))

export default props => {
	const { tokens, onSubmit }: {
		tokens: { [room: string]: { [token: string]: { name: string } } },
		onSubmit: ({ room, token }: { room: string, token: string }) => void
	} = props
	const [room, setRoom] = useState(Object.keys(tokens)[0])
	const [token, setToken] = useState(Object.keys(tokens[room])[0])
	const handleRoomSelect = roomName => {
		setRoom(roomName)
		setToken(Object.keys(tokens[roomName])[0])
	}
	const handleSubmit = e => {
		e.preventDefault()
		onSubmit({ room, token })
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
		</form>
	)
}