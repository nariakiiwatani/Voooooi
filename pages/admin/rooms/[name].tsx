const RoomAdminPage = (props) => {
	const { roomName, password, pwd } = props
	return (
		<>
			<div>admin page</div>
			<div>まだ何もできない</div>
			<div>部屋名:{roomName}</div>
			<div>パスワード:{password}</div>
		</>
	)
}

export const getServerSideProps = ({ params, query }) => {
	return {
		props: {
			roomName: params.name,
			...query
		},
	}
}
export default RoomAdminPage