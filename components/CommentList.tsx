const CommentList = (props) => {
	const { title, messages, color } = props

	return (
		<div className="wrapper">
			<div className="header">{title}</div>
			<div className="comments">
				{messages.map((m, i) => (
					<div key={i}>{m.text}</div>
				))}
				<div className="dummy"></div>
			</div>
			<style jsx>{`
			.wrapper {
				width: 100%;
				display: flex;
				flex-direction: column;
				height: calc(50vh - 20px);
				overflow: hidden;
				background-color: ${color};
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