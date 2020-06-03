import { useState, useEffect, useContext, Suspense } from "react"
import { UserContext } from '../../components/contexts/UserContext'
import EnterUser from '../../components/room/EnterUser'
import ChatRoom from '../../components/room/ChatRoom'
import MyLayout from '../../components/Layout'
import { useCollection } from '@nandorojo/swr-firestore'

const RoomPage = (props) => {
	const { roomName, pwd } = props
	const rooms = useCollection("rooms",
		{
			where: [
				["name", "==", roomName],
				["pwd", "==", pwd]
			],
			limit: 1
		}
	)
	const isRoomValid = () => (rooms && rooms.data && rooms.data.length)

	const user = useContext(UserContext)
	const isUserValid = () => (user && user.user && user.user.id && user.team && user.team.id)

	return (
		<MyLayout title={`Voext Chat - Room: ${roomName}`}>
			{!isRoomValid()
				? <div>{`room not exist`}</div>
				: isUserValid()
					? <ChatRoom roomId={rooms.data[0].id} />
					: <EnterUser roomId={rooms.data[0].id} />
			}
		</MyLayout >
	)
}

export const getServerSideProps = async ({ params, query }) => {
	return {
		props: {
			roomName: params.name,
			pwd: query.pwd
		},
	}
}
export default RoomPage