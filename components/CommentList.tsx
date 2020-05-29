import { useEffect, useState, useRef, useLayoutEffect, useMemo } from 'react';
import Color from 'color';
import { arrayToObject } from '../libs/Utils';
import { List, ListItem, ListItemText, Paper, ListSubheader, Typography } from '@material-ui/core';
import React from 'react';

const CommentList = (props) => {
	const { title, messages, team, users, local = false } = props
	const commentsRef = useRef()
	const userMap = useMemo(() => arrayToObject(users, "id"), [users])
	const bgColor = useMemo(() => new Color(team.color.color).alpha(0.5).toString(), [team])

	useEffect(() => {
		const element: HTMLElement = commentsRef.current;
		if (element.scrollHeight <= element.clientHeight) return;
		const lastCommentsTop = (count => {
			let child = element.lastElementChild
			while (child && --count > 0 && (child = child.previousElementSibling)) { }
			return child.offsetTop - element.offsetTop
		})
		const margin = 10
		const scrollBottom = element.scrollTop + element.clientHeight
		if (scrollBottom + margin > lastCommentsTop(2)) {
			scrollToBottom(element)
		}
	}, [messages]);

	useLayoutEffect(() => {
		scrollToBottom(commentsRef.current)
	}, [])

	const scrollToBottom = (element) => {
		element.scrollTop = element.scrollHeight - element.clientHeight;
	}

	const printComment = (message, local) => (
		local
			? (message.text)
			: (<ListItemText
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
			/>)
	)

	return (
		<List subheader={<ListSubheader>{title}</ListSubheader>} >
			<div ref={commentsRef}>
				{messages.map((m, i) => (
					<ListItem key={i}>
						{printComment(m, local)}
					</ListItem>
				))}
			</div>
		</List>
	)
}

export default CommentList