import { useCollection } from '@nandorojo/swr-firestore'

import { useMemo } from "react";
import { useClipboard } from "use-clipboard-copy"
import { Button } from '@material-ui/core';

const RoomAdminPage = (props) => {
	const { roomName, password, pwd, url } = props
	const origin = useMemo(() => (new URL(url).origin), [url])
	const clipboard = useClipboard()
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
			<Button
				variant="contained"
				onClick={() => {
					clipboard.copy(`${origin}/rooms/${roomName}?pwd=${pwd}`)
				}}
			>
				パスワードを含む入室URLをクリップボードにコピー
			</Button>
			<Button
				variant="contained"
				onClick={() => {
					clipboard.copy(`${origin}/admin/rooms/${roomName}?password=${password}&pwd=${pwd}`)
				}}
			>
				管理画面（ここ）のURLをクリップボードにコピー
			</Button>
		</>
	)
}

export const getServerSideProps = ({ req, params, query }) => {
	return {
		props: {
			roomName: params.name,
			password: query.password || "",
			pwd: query.pwd,
			url: new URL(req.url, `http://${req.headers.host}`).href
		},
	}
}
export default RoomAdminPage