import { Button, ListItemIcon, makeStyles, createStyles, Select, MenuItem, TextField } from '@material-ui/core'
import { People } from '@material-ui/icons'
import { useState } from 'react'

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
	teams: { id: string, name: string, color: number[] }[],
	onSelect: ({ name, team }: { name: string, team: string }) => void
}) => {
	const { teams, onSelect } = props
	const [name, setName] = useState("")
	const [team, setTeam] = useState(teams.length && teams[0].id)
	const handleSubmit = e => {
		e.preventDefault()
		onSelect({ name, team })
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
			</form>
		</>
	)
}