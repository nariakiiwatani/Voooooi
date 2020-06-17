import { useState } from "react";
import MyAdminMenu from '../../../components/admin/Menu';
import { Mic, People, Flag, Message, PersonAdd } from '@material-ui/icons';
import Invitation from '../../../components/admin/Invitation';
import EditTeams from '../../../components/admin/EditTeams';
import EditMembers from '../../../components/admin/EditMembers';
import EditMessages from '../../../components/admin/EditMessages';
import { useDocument } from '@nandorojo/swr-firestore';
import { getHashString } from '../../../libs/Utils';
import Router from 'next/router';
import EnterPassword from '../../../components/room/EnterPassword';

const RoomAdminPage = (props) => {
	const { roomName, pwd } = props

	const roomRef = useDocument<{ adminPassword: string }>(`rooms/${roomName}`)
	const [contentName, setContentName] = useState("room")

	if (!roomRef.data) {
		return <div>fetching room data...</div>
	}

	if (roomRef.data.adminPassword !== pwd) {
		return (
			<>
				<EnterPassword
					label="パスワードが違います"
					buttonText="OK"
					onSubmit={password => {
						Router.push(`/admin/rooms/${roomName}?pwd=${getHashString(password)}`)
					}} />
			</>
		)
	}

	const handleMenuSelect = hint => {
		setContentName(hint)
	}
	const menus = {
		room: {
			title: "招待",
			icon: <PersonAdd />,
			content: <Invitation roomRef={roomRef} />
		},
		team: {
			title: "チーム",
			icon: <Flag />,
			content: <EditTeams roomRef={roomRef} />

		},
		member: {
			title: "メンバー",
			icon: <People />,
			content: <EditMembers roomRef={roomRef} />
		},
		message: {
			title: "メッセージ",
			icon: <Message />,
			content: <EditMessages roomRef={roomRef} />
		}
	}
	return (
		<>
			<MyAdminMenu
				title={`管理ページ - ${roomName}`}
				onSelect={handleMenuSelect}
				menus={menus}
			>
				{menus[contentName].content}
			</MyAdminMenu>
		</>
	)
}

export const getServerSideProps = ({ req, params, query }) => {
	return {
		props: {
			roomName: params.name,
			pwd: query.pwd,
			url: new URL(req.url, `https://${req.headers.host}`).href
		},
	}
}
export default RoomAdminPage