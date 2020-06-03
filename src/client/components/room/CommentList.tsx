import { useEffect, useRef, useLayoutEffect, useMemo } from 'react';
import { List, ListItem, ListItemText, Paper, ListSubheader, Typography } from '@material-ui/core';
import React from 'react';
import { useCollection } from '@nandorojo/swr-firestore';
import { arrayToObject } from '../../libs/Utils';

const CommentList = (props) => {
	const { roomId, team } = props
	const commentsRef = useRef()
	const rootRef = useRef()
	const users = useCollection(`rooms/${roomId}/users`)
	const teams = useCollection(`rooms/${roomId}/teams`)
	const messages = useCollection(`rooms/${roomId}/messages`,
		{
			where: ["team", "==", team.id]
		}
	)

	const userMap = useMemo(() => {
		return users.data ? arrayToObject(users.data) : {}
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

	const printComment = (message) => (
		<ListItemText
			primary={message.text}
			secondary={
				<React.Fragment>
					<Typography
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

	return (
		<Paper ref={rootRef}
			style={{
				height: "100%",
				overflow: "auto",
				overflowWrap: "break-word"
			}}>
			<List subheader={<ListSubheader>{team.name}</ListSubheader>} >
				<div ref={commentsRef}>
					{messages.data && messages.data.map((m, i) => (
						<ListItem key={i}>
							{printComment(m)}
						</ListItem>
					))}
				</div>
			</List>
		</Paper>
	)
}

export default CommentList