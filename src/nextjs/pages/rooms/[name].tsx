import { useContext, useState } from "react"
import { UserContext } from '../../components/contexts/UserContext'
import EnterUser from '../../components/room/EnterUser'
import ChatRoom from '../../components/room/ChatRoom'
import MyLayout from '../../components/Layout'
import { useDocument } from '@nandorojo/swr-firestore'
import { getHashString } from '../../libs/Utils'
import EnterPassword from '../../components/room/EnterPassword'
import Router from 'next/router'

const RoomPage = (props) => {
	const { roomName, pwd } = props
	const [userPassword, setUserPassword] = useState(pwd || "")
	const room = useDocument<{ userPassword: string }>(`rooms/${roomName}/`)

	const user = useContext(UserContext)
	const isUserValid = () => user?.user?.id && user.team?.id

	const handleSubmitPassword = password => {
		const hashed = getHashString(password)
		setUserPassword(hashed)
		Router.push(`/rooms/${roomName}?pwd=${hashed}`, undefined, { shallow: true })
	}
	const isPasswordValid = () => (
		room.data.userPassword ?
			room.data.userPassword === userPassword :
			userPassword === ""
	)

	return (
		<MyLayout title={`Voext Chat - Room: ${roomName}`}>
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
			pwd: query.pwd
		},
	}
}
export default RoomPage