const CommentList = (props) => {
	const messages = props.messages.slice()
	messages.sort((a, b) => a.id - b.id)

	return (
		<div>
			{messages.map((m, i) => (
				<div key={i}>{m.text}</div>
			))}
		</div>
	)
}

export default CommentList