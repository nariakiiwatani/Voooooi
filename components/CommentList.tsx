import { useEffect, useState, useRef, useLayoutEffect, useMemo } from 'react';
import Color from 'color';
import { arrayToObject } from '../libs/Utils';

const CommentList = (props) => {
	const { title, messages, team, users, local = false } = props
	const commentsElement = useRef()
	const userMap = useMemo(() => arrayToObject(users, "id"), [users])
	const bgColor = useMemo(() => new Color(team.color.color).alpha(0.5).toString(), [team])

	useEffect(() => {
		const element: HTMLElement = commentsElement.current;
		const fromBottom = element.scrollHeight - element.scrollTop - element.clientHeight;
		if (fromBottom < 30) {
			scrollToBottom(element)
		}
	}, [messages]);

	useLayoutEffect(() => {
		scrollToBottom(commentsElement.current)
	}, [])

	const scrollToBottom = (element) => {
		console.log(messages.length)
		console.log(element.scrollTop, element.scrollHeight, element.clientHeight)
		element.scrollTop = element.scrollHeight - element.clientHeight;
	}

	const printComment = (message, local) => (
		local
			? (message.text)
			: (`${userMap[message.user].name} : ${message.text}`)
	)

	return (
		<div className="wrapper">
			<div className="header">{title}</div>
			<div className="comments" ref={commentsElement}>
				{messages.map((m, i) => (
					<div key={i} > {printComment(m, local)}</div>
				))}
			</div>
			<style jsx>{`
			.wrapper {
				width: 100%;
				display: flex;
				flex-direction: column;
				height: calc(50vh - 20px);
				overflow: hidden;
				background-color: ${bgColor};
				border: black 1px solid;
				border-radius: 12px;
			}
			.header {
				background-color: gray;
			}
			.comments {
				flex: 1 1 100%;
				overflow-y: scroll;
			}
			`}</style>
		</div >
	)
}

export default CommentList