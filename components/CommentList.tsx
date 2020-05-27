import { useEffect, useState, useRef } from 'react';
import Color from 'color';
import { arrayToObject } from '../libs/Utils';

const CommentList = (props) => {
	const { title, messages, team, users, local = false } = props
	const commentsElement = useRef()
	const [userMap, setUserMap] = useState({})
	const [bgColor, setBgColor] = useState("")

	useEffect(() => {
		const element: HTMLElement = commentsElement.current;
		const fromBottom = element.scrollHeight - element.scrollTop - element.clientHeight;
		if (fromBottom < 30) {
			element.scrollTop = element.scrollHeight - element.clientHeight;
		}
		return () => {
		}
	}, [messages]);

	useEffect(() => {
		setUserMap(arrayToObject(users, "id"))
	}, [users])

	useEffect(() => {
		setBgColor(new Color(team.color.color).alpha(0.5).toString())
	}, [team])

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