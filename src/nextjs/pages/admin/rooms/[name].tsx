import { useState } from "react";
import MyAdminMenu from '../../../components/admin/Menu';
import { Mic, People, Flag, Message } from '@material-ui/icons';
import EditRoom from '../../../components/admin/EditRoom';
import EditTeams from '../../../components/admin/EditTeams';
import EditMembers from '../../../components/admin/EditMembers';
import EditMessages from '../../../components/admin/EditMessages';

const RoomAdminPage = (props) => {
	const { roomName } = props
	const [contentName, setContentName] = useState("room")

	const handleMenuSelect = hint => {
		setContentName(hint)
	}
	const menus = {
		room: {
			title: "部屋",
			icon: <Mic />,
			content: <EditRoom roomName={roomName} />
		},
		team: {
			title: "チーム",
			icon: <Flag />,
			content: <EditTeams roomName={roomName} />

		},
		member: {
			title: "メンバー",
			icon: <People />,
			content: <EditMembers roomName={roomName} />
		},
		message: {
			title: "メッセージ",
			icon: <Message />,
			content: <EditMessages roomName={roomName} />
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