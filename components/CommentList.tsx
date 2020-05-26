import { useEffect, useState, useRef } from 'react';

const CommentList = (props) => {
	const { title, messages, color } = props
	const commentsElement = useRef()

	const bgcolor = (color => {
		const alpha = 0.5;
		switch (color) {
			case "red": return `rgba(255,0,0,${alpha})`;
			case "blue": return `rgba(0,0,255,${alpha})`;
			case "yellow": return `rgba(255,255,0,${alpha})`;
			case "white": return `rgba(128,128,128,${alpha})`;
		}
	})(color)

	useEffect(() => {
		const element: HTMLElement = commentsElement.current;
		const fromBottom = element.scrollHeight - element.scrollTop - element.clientHeight;
		if (fromBottom < 30) {
			element.scrollTop = element.scrollHeight - element.clientHeight;
		}
		return () => {
		}
	}, [messages]);

	return (
		<div className="wrapper">
			<div className="header">{title}</div>
			<div className="comments" ref={commentsElement}>
				{messages.map((m, i) => (
					<div key={i}>{m.userName}:{m.text}</div>
				))}
			</div>
			<style jsx>{`
			.wrapper {
				width: 100%;
				display: flex;
				flex-direction: column;
				height: calc(50vh - 20px);
				overflow: hidden;
				background-color: ${bgcolor};
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
		</div>
	)
}

export default CommentList