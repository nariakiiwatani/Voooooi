import { useState, useEffect, useContext } from "react"
import { UserContext } from '../../components/contexts/UserContext'
import EnterUser from '../../components/room/EnterUser'
import ChatRoom from '../../components/room/ChatRoom'
import MyLayout from '../../components/Layout'
import { useCollection } from '@nandorojo/swr-firestore'

const RoomPage = (props) => {
	const { roomName, pwd } = props
	const [userValid, setUserValid] = useState(false)
	const room = useCollection("rooms", {
		where: [
			["name", "==", roomName],
			["pwd", "==", pwd]
		],
		limit: 1
	})
	const [error, setError] = useState("")

	const user = useContext(UserContext)

	// check user info
	useEffect(() => {
		setUserValid(user && user.user && user.user.id && user.team && user.team.id)
	}, [userValid, user.user, user.team])

	// check room exists
	if (!room.data) {
		return (<div>{`getting room data`}</div>)
	}
	else if (room.data.length === 0) {
		return (<div>{`room not exist`}</div>)
	}
	const roomId = room.data[0].id

	return (
		<MyLayout title={`Voext Chat - Room: ${roomName}`}>
			{!userValid
				? <EnterUser roomId={roomId} />
				: <ChatRoom roomId={roomId} />
			}
		</MyLayout >
	)
}

export const getServerSideProps = async ({ params, query }) => {
	return {
		props: {
			roomName: params.room,
			...query
		},
	}
}
export default RoomPage