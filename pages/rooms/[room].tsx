import { useState } from "react"

const Room = (props) => {
	const { roomId, username, userteam } = props
	const [talking, setTalking] = useState("")

	const debugInfo = () => (
		<div>
			<div>Room:{roomId}</div>
			<div>username:{username}</div>
			<div>userteam:{userteam}</div>
		</div>
	)
	const handleChange = e => {
		setTalking(e.target.value)
	}
	const handleSubmit = e => {
		e.preventDefault()
	}
	const textInput = () => (
		<form onSubmit={handleSubmit}>
			<input type="text" value={talking} onChange={handleChange} />
		</form>
	)

	return (
		<div>
			{debugInfo()}
			{textInput()}
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