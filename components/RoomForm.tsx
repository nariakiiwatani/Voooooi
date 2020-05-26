import { useState } from "react"
import Router from "next/router"
import { getHashString } from '../libs/Utils'

const RoomForm = props => {

	const [formInput, setFormInput] = useState({
		roomName: "",
		password: "",
	})
	const { roomName, password } = formInput

	const handleChange = name => e => {
		setFormInput({
			...formInput,
			[name]: e.target.value
		})
	}
	const createInput = ([label, type, name, value]) => (
		<div>
			<span>{label}</span><input type={type} name={name} value={value} onChange={handleChange(name)} />
		</div>
	)

	const handleEnterSubmit = async e => {
		e.preventDefault()
		props.onEnter({
			roomName, password
		})
	}
	const handleCreateSubmit = async e => {
		e.preventDefault()
		props.onCreate({
			roomName, password
		})
	}

	return (
		<>
			<form>
				{createInput(["部屋名", "text", "roomName", roomName])}
				{createInput(["パスワード", "password", "password", password])}
				< button onClick={handleEnterSubmit}>部屋に入る</button>
				< button onClick={handleCreateSubmit}>部屋を作る</button>
			</form>
			<span className="error">{props.error}</span>
		</>
	)

}

export default RoomForm;
