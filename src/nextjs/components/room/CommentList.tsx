import { useEffect, useRef, useLayoutEffect, useMemo, RefObject } from 'react';
import { List, ListItem, ListItemText, Paper, ListSubheader, Typography } from '@material-ui/core';
import { useCollection } from '@nandorojo/swr-firestore';
import { makeStyles } from '@material-ui/styles';
import { useScroll } from "react-use"
import React from "react"

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


const useScrollCustom = (ref: RefObject<HTMLElement>) => {
	const original = useScroll(ref)

	return {
		...original,
		left: original.x,
		top: original.y,
		right: ref.current && (ref.current.scrollWidth - original.x - ref.current.clientWidth),
		bottom: ref.current && (ref.current.scrollHeight - original.y - ref.current.clientHeight),
	}
}

const CommentList = (props) => {
	const { roomId, team } = props
	const commentsRef = useRef()
	const scrollRef = useRef(null);
	const { bottom: restScroll } = useScrollCustom(scrollRef);
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
		const scroller: HTMLElement = scrollRef.current;
		const calcCommentsHeight = count => {
			let ret = 0;
			for (let child = comments.lastElementChild as HTMLElement; count-- > 0 && child; child = child.previousElementSibling as HTMLElement) {
				ret += child.clientHeight
			}
			return ret
		}
		const margin = 10
		if (restScroll < calcCommentsHeight(2) + margin) {
			scrollToBottom(scroller)
		}
	}, [messages.data]);

	useLayoutEffect(() => {
		scrollToBottom(scrollRef.current)
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
		<Paper ref={scrollRef}
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