import { useState, useEffect, useContext } from "react"
import Router from 'next/router'
import { UserContext } from '../../components/contexts/UserContext'
import EnterUser from '../../components/EnterUser'
import ChatRoom from '../../components/ChatRoom'
import MyLayout from '../../components/Layout'
import { useCollection } from "@nandorojo/swr-firestore"
import { findRoomByName } from '../../libs/Firebase'

const RoomPage = (props) => {
	const { roomId, roomName, pwd } = props
	const [userValid, setUserValid] = useState(false)

	const users = useCollection(`rooms/${roomId}/users`)
	const teams = useCollection(`rooms/${roomId}/teams`)
	const [error, setError] = useState("")

	const user = useContext(UserContext)

	// check user info
	useEffect(() => {
		setUserValid(user && user.user && user.user.id && user.team && user.team.id)
	}, [userValid, user.user, user.team])

	// check room exists
	if (!roomId) {
		return (<div>{`room(${roomName}) not exist`}</div>)
	}
	// check team info
	if (!teams.data) {
		return (<div>チーム情報を取得中</div>)
	}


	const handleSubmitUser = ({ name, team }) => {
		const asyncFunc = async () => {
			const response = await fetch(`/api/users`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json; charset=utf-8",
				},
				body: JSON.stringify({ name, room: user.room.id, pwd, team: team.id })
			})
			if (response.ok) {
				const result = await response.json()
				//				await getRoomInfo({ users: true, teams: true, messages: true })
				user.setUser(result.data)
				user.setTeam(team)
				setError("")
			}
			else {
				Router.push("/")
			}
		}
		asyncFunc()
	}
	return (
		<MyLayout title={`Voext Chat - Room: ${roomName}`}>
			{!userValid
				? <EnterUser teams={teams.data} onSubmit={handleSubmitUser} />
				: <ChatRoom teams={teams} users={users} />
			}
		</MyLayout >
	)
}

export const getServerSideProps = async ({ params, query }) => {
	let roomId = "";
	try {
		const response = await findRoomByName({ name: query.room, pwd: query.pwd })
		console.info(response)
		roomId = response[0].id
	}
	catch (error) {
		console.log(error);
	}

	return {
		props: {
			roomId,
			roomName: params.room,
			...query
		},
	}
}
export default RoomPage