import { useState } from "react"
import { TextField, Button } from "@material-ui/core"
import { getHashString } from '../../libs/Utils'
import { fuego } from '@nandorojo/swr-firestore';
import Router from 'next/router'

const EnterRoom = props => {

	const [error, setError] = useState("")

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
	const createInput = ([label, type, name, value, id = label]) => (
		<div key={id}>
			<TextField fullWidth
				type={type}
				label={label}
				name={name}
				value={value}
				onChange={handleChange(name)}
			/>
		</div>
	)

	const handleSubmit = async e => {
		e.preventDefault()

		const pwd = getHashString(password)
		const room = await fuego.db.doc(`rooms/${roomName}`).get()
		if (!room.exists) {
			setError(`room:${roomName} not exist`)
			return
		}
		setError("")
		Router.push({
			pathname: `/rooms/${roomName}`,
			query: { pwd }
		})
	}

	return (
		<>
			<form onSubmit={handleSubmit}>
				{createInput(["部屋名", "text", "roomName", roomName])}
				{createInput(["パスワード", "password", "password", password])}
				<Button
					fullWidth
					onClick={handleSubmit}
					variant="contained"
					color="primary"
				>部屋に入る</Button>
			</form>
			<span className="error">{error}</span>
		</>
	)

}

export default EnterRoom;
