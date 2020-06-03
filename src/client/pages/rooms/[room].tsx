import { useState, useEffect, useContext } from "react"
import Router from 'next/router'
import { UserContext } from '../../components/contexts/UserContext'
import EnterUser from '../../components/room/EnterUser'
import ChatRoom from '../../components/room/ChatRoom'
import MyLayout from '../../components/Layout'
import { useCollection } from "@nandorojo/swr-firestore"
import { findRoomByName } from '../../libs/Firebase'

const RoomPage = (props) => {
	const { roomId, roomName, pwd } = props
	const [userValid, setUserValid] = useState(false)

	const [error, setError] = useState("")

	const user = useContext(UserContext)

	// check user info
	useEffect(() => {
		setUserValid(user && user.user && user.user.id && user.team && user.team.id)
	}, [userValid, user.user, user.team])

	// check room exists
	if (!roomId) {
		return (<div>{`room(${roomName}) not exist`}</div>)
	}


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
	let roomId = "";
	try {
		const response = await findRoomByName({ name: query.room, pwd: query.pwd })
		console.info(response)
		roomId = response[0].id
	}
	catch (error) {
		console.log(error);
	}

	return {
		props: {
			roomId,
			roomName: params.room,
			...query
		},
	}
}
export default RoomPage