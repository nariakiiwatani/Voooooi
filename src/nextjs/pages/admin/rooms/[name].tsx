import { useCollection } from '@nandorojo/swr-firestore'
import Link from "next/link"

const RoomAdminPage = (props) => {
	const { roomName, password, pwd } = props
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

	return (
		<>
			<div>admin page</div>
			<div>部屋名:{roomName}</div>
			<div>パスワード:{password}</div>
			<div>
				<Link href={`/rooms/${roomName}?pwd=${pwd}`}><a>入室リンク(パスワードあり）</a></Link>
			</div>
			<div>
				<Link href={`/admin/rooms/${roomName}?password=${password}&pwd=${pwd}`}><a>管理画面（ここ）</a></Link>
			</div>
		</>
	)
}

export const getServerSideProps = ({ params, query }) => {
	return {
		props: {
			roomName: params.name,
			...query
		},
	}
}
export default RoomAdminPage