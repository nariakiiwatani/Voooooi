import { Button, ListItemIcon, makeStyles, createStyles } from '@material-ui/core'
import { People } from '@material-ui/icons'

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
	const classes = useStyle()
	const handleSelect = teamId => {
		onSelect(teamId)
	}
	return (
		<>
			<h4>チームを選択して入室</h4>
			{teams.filter(t => t.id !== "admin").map((t, i) => {
				const cssProperty = {
					color: `rgb(${t.color.join(",")})`
				}
				return (
					<Button
						fullWidth
						key={i}
						className={classes.buttonFollowsText}
						aria-label={t.name}
						startIcon={
							<ListItemIcon>
								<People style={cssProperty} />
							</ListItemIcon>
						}
						size="small"
						onClick={() => { handleSelect(t.id) }}
					>
						{t.name}
					</Button>
				)
			})}
		</>
	)
}