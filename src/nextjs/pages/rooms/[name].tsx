import { useContext, useState, useEffect } from "react"
import { UserContext } from '../../components/contexts/UserContext'
import EnterUser from '../../components/room/EnterUser'
import ChatRoom from '../../components/room/ChatRoom'
import MyLayout from '../../components/Layout'
import { useDocument } from '@nandorojo/swr-firestore'
import { getHashString } from '../../libs/Utils'
import EnterPassword from '../../components/room/EnterPassword'

const RoomPage = (props) => {
	const { roomName } = props
	const room = useDocument(`rooms/${roomName}/`)

	const context = useContext(UserContext)
	const isUserValid = () => context?.user?.get() && context.team?.get()

	if (!room.data) {
		return (<div>fetching room data...</div>)
	}
	if (!room.data.exists) {
		return (<div>room not exist</div>)
	}

	return (
		<MyLayout title={`Voooooi!（ゔぉーい！） - Room: ${roomName}`}>
			{!isUserValid()
				? <EnterUser room={room.data} />
				: <ChatRoom room={room.data} />
			}
		</MyLayout >
	)
}

export const getServerSideProps = async ({ params, query }) => {
	return {
		props: {
			roomName: params.name,
			...query
		},
	}
}
export default RoomPage