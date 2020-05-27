import { useState, useEffect, useContext } from "react"
import Router from 'next/router'
import { UserContext } from '../../components/contexts/UserContext'
import EnterUser from '../../components/EnterUser'
import ChatRoom from '../../components/ChatRoom'

const RoomPage = (props) => {
	const { roomName, pwd } = props
	const [userValid, setUserValid] = useState(false)
	const [teams, setTeams] = useState([])
	const [error, setError] = useState("")

	const user = useContext(UserContext)

	// check room exists and password valid
	useEffect(() => {
		const asyncFunc = async () => {
			const response = await fetch(`/api/rooms/${roomName}?pwd=${pwd}`)
			if (response.status === 200) {
				const result = await response.json()
				user.setRoom(result.data)
				setError("")
			}
			else {
				Router.push("/")
			}
		}
		asyncFunc()
	}, [])

	// get team list
	useEffect(() => {
		if (user.room.id) {
			const asyncFunc = async () => {
				const response = await fetch(`/api/teams?room=${user.room.id}&pwd=${pwd}`)
				if (response.status === 200) {
					const result = await response.json()
					setTeams(result.data)
					setError("")
				}
				else {
					Router.push("/")
				}
			}
			asyncFunc()
		}
	}, [user.room.id])

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

	const handleSubmitUser = ({ name, team }) => {
		const asyncFunc = async () => {
			const response = await fetch(`/api/users/${name}`, {
				method: "POST"
			})
			if (response.status === 201) {
				const result = await response.json()
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
		<>
			{!userValid
				? <EnterUser teams={teams} onSubmit={handleSubmitUser} />
				: <ChatRoom teams={teams} />}
			<span className="error">{error}</span>
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