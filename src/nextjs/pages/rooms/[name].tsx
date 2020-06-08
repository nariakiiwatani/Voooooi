import { useContext } from "react"
import { UserContext } from '../../components/contexts/UserContext'
import EnterUser from '../../components/room/EnterUser'
import ChatRoom from '../../components/room/ChatRoom'
import MyLayout from '../../components/Layout'
import { useDocument } from '@nandorojo/swr-firestore'

const RoomPage = (props) => {
	const { roomName, pwd } = props
	const room = useDocument(`rooms/${roomName}/`)

	const user = useContext(UserContext)
	const isUserValid = () => (user && user.user && user.user.id && user.team && user.team.id)

	return (
		<MyLayout title={`Voext Chat - Room: ${roomName}`}>
			{!room?.data?.exists
				? <div>{`room not exist`}</div>
				: isUserValid()
					? <ChatRoom room={room.data} />
					: <EnterUser room={room.data} />
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