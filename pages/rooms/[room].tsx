import { useState, useEffect, useContext } from "react"
import Router from 'next/router'
import { UserContext } from '../../components/contexts/UserContext'
import EnterPassword from '../../components/EnterPassword'
import EnterUser from '../../components/EnterUser'
import ChatRoom from '../../components/ChatRoom'

const RoomPage = (props) => {
	const { roomName, pwd } = props
	const [pwdValid, setPwdValid] = useState(false)
	const [userValid, setUserValid] = useState(false)

	const user = useContext(UserContext)

	// check room exists
	useEffect(() => {
		const asyncFunc = async () => {
			const response = await fetch(`/api/rooms/${roomName}`)
			if (response.status === 200) {
				const result = await response.json()
				user.setRoom(result.data)
			}
			else {
				Router.push("/")
			}
		}
		asyncFunc()
	}, [])

	// check pwd
	useEffect(() => {
		setPwdValid(user && user.room && user.room.pwd === pwd)
	}, [pwdValid, user.room])

	// check user info
	useEffect(() => {
		setUserValid(user && user.user && user.user.id && user.team && user.team.id)
	}, [userValid, user.user, user.team])

	useEffect(() => {
		// const asyncFunc = async () => {
		// 	const query = "params=teams,messages"
		// 	const response = await fetch(`/api/rooms/${room.name}?${query}`)
		// 	if (response.status !== 200) {
		// 		console.log("チーム一覧の取得に失敗", await response.json())
		// 		return;
		// 	}
		// 	const result = (await response.json()).data
		// 	console.log("result", result)
		// 	const { teams, messages } = result
		// 	const comments = objectToArray(teams).reduce((acc, { name }) => { acc[name] = []; return acc }, {})
		// 	objectToArray(messages).forEach(m => {
		// 		console.info(m)
		// 		if (Array.isArray(comments[m.teamName])) {
		// 			comments[m.teamName].push(m)
		// 		}
		// 	})
		// 	setTeamComments(comments)
		// }
		// asyncFunc();
	}, [])


	return (
		<>
			{!pwdValid ? <EnterPassword /> :
				!userValid ? <EnterUser /> :
					<ChatRoom />}
		</>
	)
}

export const getServerSideProps = ({ params, query }) => {
	return {
		props: {
			roomName: params.room,
			...query
		},
	}
}
export default RoomPage