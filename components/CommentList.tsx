const CommentList = (props) => {
	const messages = props.messages.slice()

	return (
		<div>
			{messages.map((m, i) => (
				<div key={i}>{m.text}</div>
			))}
		</div>
	)
}

export default CommentList