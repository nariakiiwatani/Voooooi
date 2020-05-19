import { useState } from "react"
import VoextInput from '../../components/VoextInput'

const Room = (props) => {
	const { roomId, username, userteam } = props

	const debugInfo = () => (
		<div>
			<div>Room:{roomId}</div>
			<div>username:{username}</div>
			<div>userteam:{userteam}</div>
		</div>
	)
	const onVoextSubmit = (text) => {
	}

	return (
		<div>
			{debugInfo()}
			{<VoextInput onSubmit={onVoextSubmit} />}
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