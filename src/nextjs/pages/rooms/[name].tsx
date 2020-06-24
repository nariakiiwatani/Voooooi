import { useContext, useState, useEffect } from "react"
import { UserContext } from '../../components/contexts/UserContext'
import EnterUser from '../../components/index/EnterUser'
import ChatRoom from '../../components/room/ChatRoom'
import MyLayout from '../../components/Layout'
import { useDocument } from '@nandorojo/swr-firestore'
import { getHashString } from '../../libs/Utils'

const RoomPage = (props: { name: string, pwd?: string }) => {
	const { name, pwd = getHashString("") } = props
	const room = useDocument(`rooms/${name}/`)
	const context = useContext(UserContext)
	const user = useDocument(`rooms/${name}/users/${context.user.get()}`)

	const [signedIn, setSignedIn] = useState(false)
	useEffect(() => {
		setSignedIn(user.data?.exists)
	}, [user.data])

	if (!room.data) {
		return (<div>fetching room data...</div>)
	}
	if (!room.data.exists) {
		return (<div>room not exist</div>)
	}

	return (
		<MyLayout title={`Voooooi!（ゔぉーい！） - Room: ${name}`}>
			{signedIn
				? <ChatRoom room={room.data} />
				: (<>
					<h4>選手名とチームを入力してください</h4>
					<EnterUser room={name} pwd={pwd} />
				</>)
			}
		</MyLayout >
	)
}

export const getServerSideProps = async ({ params, query }) => {
	return {
		props: {
			...params,
			...query
		},
	}
}
export default RoomPage