import { useEffect, useRef, useLayoutEffect, useMemo } from 'react';
import { List, ListItem, ListItemText, Paper, ListSubheader, Typography } from '@material-ui/core';
import React from 'react';
import { useCollection } from '@nandorojo/swr-firestore';
import { makeStyles } from '@material-ui/styles';

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


const CommentList = (props) => {
	const { roomId, team } = props
	const commentsRef = useRef()
	const rootRef = useRef()
	const users = useCollection(`rooms/${roomId}/users`)
	const messages = useCollection(`rooms/${roomId}/messages`,
		{
			listen: true,
			where: ["team", "==", team.id],
			orderBy: ["createdAt", "asc"]
		}
	)

	const userMap = useMemo(() => {
		return !users.data ?
			{} :
			users.data.reduce((acc, user) => ({ ...acc, [user.id]: user }), {})
	}, [users])

	useEffect(() => {
		const comments: HTMLElement = commentsRef.current;
		const scroller: HTMLElement = rootRef.current;
		if (scroller.scrollHeight <= scroller.clientHeight) return;
		const lastCommentsTop = (count => {
			let child: HTMLElement = comments.lastElementChild as HTMLElement
			while (child && --count > 0 && (child = child.previousElementSibling as HTMLElement)) { }
			return child.offsetTop - scroller.offsetTop
		})
		const margin = 10
		const scrollBottom = scroller.scrollTop + scroller.clientHeight
		if (scrollBottom + margin > lastCommentsTop(1)) {
			scrollToBottom(scroller)
		}
	}, [messages]);

	useLayoutEffect(() => {
		scrollToBottom(rootRef.current)
	}, [])

	const scrollToBottom = (element) => {
		element.scrollTop = element.scrollHeight - element.clientHeight;
	}


	const styles = useStyles(team)
	const printComment = (message) => {

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
							- {userMap[message.user].name}
						</Typography>
					</React.Fragment>
				}
			/>
		)
	}

	return (
		<Paper ref={rootRef}
			style={{
				height: "100%",
				overflow: "auto",
				overflowWrap: "break-word"
			}}>
			<List
				subheader={<ListSubheader>{team.name}</ListSubheader>}
				dense
			>
				<div ref={commentsRef}>
					{messages.data && messages.data.map((m, i) => (
						<ListItem key={i} >
							{printComment(m)}
						</ListItem>
					))}
				</div>
			</List>
		</Paper >
	)
}

export default CommentList