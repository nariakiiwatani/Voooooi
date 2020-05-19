import { useState } from "react"

const Index = () => {

	const [roomCreation, setRoomCreation] = useState(false)

	const handleCreateSubmit = e => {
		e.preventDefault()

	}
	const handleEnterSubmit = e => {
		e.preventDefault()

	}
	const createForm = () => (
		<form onSubmit={handleCreateSubmit}>
			<span>部屋ID</span><input type="text" name="roomId" /><br />
			<span>パスワード</span><input type="password" name="password" /><br />
			<button onClick={handleCreateSubmit}>作成</button>
		</form>
	)
	const enterForm = () => (
		<form onSubmit={handleEnterSubmit}>
			<span>部屋ID</span><input type="text" name="roomId" /><br />
			<span>パスワード</span><input type="password" name="password" /><br />
			<span>名前</span><input type="text" name="name" /><br />
			<span>チーム</span><input type="text" name="team" /><br />
			<button onClick={handleEnterSubmit}>入室</button>
		</form>
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
