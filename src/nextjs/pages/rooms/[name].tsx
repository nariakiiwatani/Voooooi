import { useContext, useState, useEffect } from "react"
import { UserContext } from '../../components/contexts/UserContext'
import SignUp from '../../components/index/SignUp'
import ChatRoom from '../../components/room/ChatRoom'
import MyLayout from '../../components/Layout'
import { useDocument } from '@nandorojo/swr-firestore'
import { getHashString, makeQueryString } from '../../libs/Utils'
import useSWR from 'swr'
import EnterPassword from '../../components/room/EnterPassword'
import Router from 'next/router'
import Link from "next/link"

const RoomPage = (props: { name: string, pwd?: string }) => {
	const { name, pwd = getHashString("") } = props
	const context = useContext(UserContext)
	const query = context.token.get() !== "" ? { token: context.token.get() } : { pwd }
	const roomFetcher = (url) => fetch(`${url}?${makeQueryString(query)}`)
		.then(r => r.json())
		.then(r => r.data.room)
		.catch(e => ({ error: "error" }))
	const { data: room, error } = useSWR(`/api/rooms/${name}`, roomFetcher)
	const user = useDocument(`rooms/${name}/users/${context.user.get()}`)

	const [signedIn, setSignedIn] = useState(false)
	useEffect(() => {
		setSignedIn(user.data?.exists)
	}, [user.data])


	return (
		<MyLayout title={`Voooooi!（ゔぉーい！） - Room: ${name}`}>
			{
				room === undefined ? "fetching room data..." :
					signedIn ? <ChatRoom room={room} /> :
						error || room.error ? (<>
							<div>部屋が存在しないかパスワードが間違っています</div>
							<EnterPassword
								buttonText="パスワードを入力"
								onSubmit={pw => {
									Router.push({
										pathname: `/rooms/${name}`,
										query: { pwd: getHashString(pw) }
									})
								}}
							/>
							<Link href="/"><a>トップページへ</a></Link>
						</>) :
							(<>
								<h4>選手名とチームを入力してください</h4>
								<SignUp room={name} pwd={pwd} />
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