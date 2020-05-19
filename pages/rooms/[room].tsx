const Room = (props) => {
	const { roomId, username, userteam } = props

	return (
		<div>
			<h1>Room:{roomId}</h1>
			<p>username:{username}</p>
			<p>userteam:{userteam}</p>
		</div>
	)
}

export const getServerSideProps = async ({ params, query }) => {
	return {
		props: {
			roomId: params.room,
			username: query.username,
			userteam: query.userteam,
		},
	}
}
export default Room