import { useContext, useState, useEffect } from "react"
import { UserContext } from '../../components/contexts/UserContext'
import EnterUser from '../../components/index/EnterUser'
import ChatRoom from '../../components/room/ChatRoom'
import MyLayout from '../../components/Layout'
import { useDocument } from '@nandorojo/swr-firestore'
import { getHashString, makeQueryString } from '../../libs/Utils'
import useSWR from 'swr'

const RoomPage = (props: { name: string, pwd?: string }) => {
	const { name, pwd = getHashString("") } = props
	const roomFetcher = (url) => fetch(`${url}?${makeQueryString({ pwd })}`)
		.then(r => r.json())
		.then(r => r.data.room)
	const { data: room, error } = useSWR(`/api/rooms/${name}`, roomFetcher)
	const context = useContext(UserContext)
	const user = useDocument(`rooms/${name}/users/${context.user.get()}`)

	const [signedIn, setSignedIn] = useState(false)
	useEffect(() => {
		setSignedIn(user.data?.exists)
	}, [user.data])


	return (
		<MyLayout title={`Voooooi!（ゔぉーい！） - Room: ${name}`}>
			{signedIn ? <ChatRoom room={room} /> :
				error ? "error while fetching room data" :
					room === undefined ? "fetching room data..." :
						(<>
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