import { useState } from "react"

const Index = () => {

	const [roomCreation, setRoomCreation] = useState(false)
	const [formInput, setFormInput] = useState({
		roomId: "",
		password: "",
		username: "",
		userteam: ""
	})
	const { roomId, password, username, userteam } = formInput

	const handleChange = name => e => {
		setFormInput({
			...formInput,
			[name]: e.target.value
		})
		console.info(formInput)
	}

	const handleCreateSubmit = async e => {
		e.preventDefault()
		const result = await fetch(`/api/rooms/${roomId}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json; charset=utf-8",
			},
			body: JSON.stringify({ password })
		})
		console.info("fetch result", await result.json())
	}
	const handleEnterSubmit = e => {
		e.preventDefault()

	}
	const createInput = ([label, type, name, value]) => (
		<div>
			<span>{label}</span><input type={type} name={name} value={value} onChange={handleChange(name)} />
		</div>
	)
	const createForm = () => (
		<form onSubmit={handleCreateSubmit}>
			{createInput(["部屋ID", "text", "roomId", roomId])}
			{createInput(["パスワード", "password", "password", password])}
			<button onClick={handleCreateSubmit}>作成</button>
		</form>
	)
	const enterForm = () => (
		<form onSubmit={handleEnterSubmit}>
			{createInput(["部屋ID", "text", "roomId", roomId])}
			{createInput(["パスワード", "password", "password", password])}
			{createInput(["名前", "text", "username", username])}
			{createInput(["チーム", "text", "userteam", userteam])}
			< button onClick={handleEnterSubmit} > 入室</button>
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
		</div>
	);
};

export default Index;
