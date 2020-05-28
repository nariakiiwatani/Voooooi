import { useEffect, useState, useRef, useLayoutEffect, useMemo } from 'react';
import Color from 'color';
import { arrayToObject } from '../libs/Utils';

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
			: (`${userMap[message.user].name} : ${message.text}`)
	)

	return (
		<div className="wrapper">
			<div className="header">{title}</div>
			<div className="comments" ref={commentsRef}>
				{messages.map((m, i) => (
					<div key={i}> {printComment(m, local)}</div>
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