import { Button, ListItemIcon, makeStyles, createStyles, Select, MenuItem } from '@material-ui/core'
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
export default props => {
	const { teams, onSelect } = props
	const [selected, setSelected] = useState("")
	const handleSubmit = e => {
		e.preventDefault()
		onSelect(selected)
	}
	const classes = useStyle()
	return (
		<>
			<form onSubmit={handleSubmit}>
				<Select
					fullWidth
					value={selected}
					onChange={e => { setSelected(e.target.value as string) }}
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
					disabled={selected === ""}
				>
					入室
				</Button>
			</form>
		</>
	)
}