import { makeStyles, ListItemText, Typography } from '@material-ui/core'; import React, { useMemo } from 'react';
import reactStringReplace from "react-string-replace"

const useStyles = makeStyles({
	commentBack: ({ color, id }: { color: number[], id: string }) => (
		id === "admin" ? {
			backgroundColor: `rgba(${color.join(",")},0.2)`,
			paddingLeft: 8,
			paddingRight: 8,
			paddingTop: 4,
			paddingBottom: 4,
			borderRadius: 0
		} : {
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
	},
	ngComment: {
		fontStyle: "italic",
		color: "red"
	}
});

const UserComment = props => {
	const { message, user, team, ng } = props

	const styles = useStyles(team || { color: [0, 0, 0] })

	const showMessage = () => {
		let ret = message.text
		let key = 0
		ng?.filter(ng => (ng.regexp ? ret.match(ng.text) !== null : ret.indexOf(ng.text) >= 0))
			.forEach(ng => {
				const replace = <span key={++key} className={styles.ngComment}>{ng.replace}</span>
				ret = ng.replaceWholeMessage ? replace : reactStringReplace(ret, ng.regexp ? new RegExp(`(${ng.text})`, "g") : ng.text, () => replace)
			})
		return ret
	}

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
						{showMessage()}
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