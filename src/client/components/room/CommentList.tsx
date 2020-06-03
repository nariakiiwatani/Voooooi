import { useEffect, useState, useRef, useLayoutEffect, useMemo } from 'react';
import Color from 'color';
import { arrayToObject } from '../../libs/Utils';
import { List, ListItem, ListItemText, Paper, ListSubheader, Typography } from '@material-ui/core';
import React from 'react';

const CommentList = (props) => {
	const { title, messages, team, users, local = false } = props
	const commentsRef = useRef()
	const rootRef = useRef()
	const userMap = useMemo(() => arrayToObject(users, "id"), [users])
	const bgColor = useMemo(() => new Color(team.color.color).alpha(0.5).toString(), [team])

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
		<Paper ref={rootRef}
			style={{
				height: "100%",
				overflow: "auto",
				overflowWrap: "break-word"
			}}>
			<List subheader={<ListSubheader>{title}</ListSubheader>} >
				<div ref={commentsRef}>
					{messages.map((m, i) => (
						<ListItem key={i}>
							{printComment(m, local)}
						</ListItem>
					))}
				</div>
			</List>
		</Paper>
	)
}

export default CommentList