import { useState } from "react"
import Router from 'next/router'
import TeamSelectionModal from "../components/TeamSelectionModal"
import { mapToArray, objectToArray } from '../libs/Utils';
import { Room } from '../libs/Models';

const Index = () => {

	const [roomCreation, setRoomCreation] = useState(false)
	const [formInput, setFormInput] = useState({
		roomName: "",
		password: "",
		userName: ""
	})
	const { roomName, password, userName } = formInput

	const [teamSelectionVisible, setTeamSelectionVisible] = useState(false)
	const [room, setRoom] = useState({})

	const handleChange = name => e => {
		setFormInput({
			...formInput,
			[name]: e.target.value
		})
	}

	const handleCreateSubmit = async e => {
		e.preventDefault()
		const result = await fetch(`/api/rooms/${roomName}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json; charset=utf-8",
			},
			body: JSON.stringify({ password })
		})
		console.info("fetch result", await result.json())
	}
	const handleEnterSubmit = async e => {
		e.preventDefault()
		const result = await fetch(`/api/rooms/${roomName}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json; charset=utf-8",
			}
		})
		if (result.status === 200) {
			const response = (await result.json()).data
			setRoom(response)
			setTeamSelectionVisible(true)
		}
		else {
			const response = await result.json()
			console.info("response(error)", response);
		}
	}

	const handleTeamSelect = (team) => {
		setTeamSelectionVisible(false)
		console.info(team)
		Router.push({
			pathname: `/rooms/${roomName}`,
			query: { roomId: room.id, roomName, userName, teamName: team.name }
		})
	}
	const handleTeamSelectCancel = () => {
		setTeamSelectionVisible(false)
	}

	const createInput = ([label, type, name, value]) => (
		<div>
			<span>{label}</span><input type={type} name={name} value={value} onChange={handleChange(name)} />
		</div>
	)
	const createForm = () => (
		<form onSubmit={handleCreateSubmit}>
			{createInput(["部屋ID", "text", "roomName", roomName])}
			{createInput(["パスワード", "password", "password", password])}
			<button onClick={handleCreateSubmit}>作成</button>
		</form>
	)
	const enterForm = () => (
		<form onSubmit={handleEnterSubmit}>
			{createInput(["部屋ID", "text", "roomName", roomName])}
			{createInput(["パスワード", "password", "password", password])}
			{createInput(["名前", "text", "userName", userName])}
			< button onClick={handleEnterSubmit}>入室</button>
		</form >
	)
	const showSwitch = () => (
		<div>
			<p onClick={() => { setRoomCreation(false) }}>部屋に入る</p>
			<p onClick={() => { setRoomCreation(true) }}>部屋を作る</p>
		</div>
	)
	return (
		<div>
			<h1>Voext</h1>
			{showSwitch()}
			{roomCreation ? createForm() : enterForm()}
			{teamSelectionVisible ?
				<TeamSelectionModal
					teams={objectToArray(room.teams)}
					onDecide={(t) => { handleTeamSelect(t) }}
					onCancel={() => { handleTeamSelectCancel() }}
				/> : <div>Hi</div>}
		</div>
	);
};

export default Index;
