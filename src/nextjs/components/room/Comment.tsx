import { makeStyles, ListItemText, Typography } from '@material-ui/core'; import React, { useMemo } from 'react';

const useStyles = makeStyles({
	commentBack: ({ color }: { color: number[] }) => ({
		backgroundColor: `rgba(${color.join(",")},0.2)`,
		paddingLeft: 8,
		paddingRight: 8,
		paddingTop: 4,
		paddingBottom: 4,
		borderRadius: 16
	}),
	commentPrimary: {
	},
	commentSecondary: {
		float: "right",
	}
});

const UserComment = props => {
	const { message, user, team } = props


	const styles = useStyles(team)
	return (
		<ListItemText
			className={styles.commentBack}
			primary={
				<React.Fragment>
					<Typography
						className={styles.commentPrimary}
						component="span"
						variant="body1"
						color="textPrimary"
					>
						{message.text}
					</Typography>
				</React.Fragment>
			}
			secondary={
				<React.Fragment>
					<Typography
						className={styles.commentSecondary}
						component="span"
						variant="caption"
						color="textPrimary"
					>
						- {user && user.name}
					</Typography>
				</React.Fragment>
			}
		/>
	)
}

export default UserComment