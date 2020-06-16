import { useContext, useState, useEffect } from "react"
import { UserContext } from '../../components/contexts/UserContext'
import EnterUser from '../../components/room/EnterUser'
import ChatRoom from '../../components/room/ChatRoom'
import MyLayout from '../../components/Layout'
import { useDocument } from '@nandorojo/swr-firestore'
import { getHashString } from '../../libs/Utils'
import EnterPassword from '../../components/room/EnterPassword'

const RoomPage = (props) => {
	const { roomName, pwd } = props
	const room = useDocument<{ userPassword: string }>(`rooms/${roomName}/`)

	const context = useContext(UserContext)
	const isUserValid = () => context?.user?.get() && context.team?.get()

	const handleSubmitPassword = password => {
		const hashed = getHashString(password)
		context.token.set(hashed)
	}

	const isPasswordValid = () => {
		if (pwd !== undefined) {
			context.token.set(pwd)
		}
		const token = context.token.get()
		return room.data.userPassword ?
			room.data.userPassword === token :
			token === ""
	}

	return (
		<MyLayout title={`Voooooi! - ${roomName}`}>
			{!room?.data?.exists
				? <div>{`room not exist`}</div>
				: !isPasswordValid()
					? <EnterPassword label="入室パスワード" buttonText="入室" onSubmit={handleSubmitPassword} />
					: !isUserValid()
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