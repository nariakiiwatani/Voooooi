import { useState } from "react"
import { TextField, Button } from "@material-ui/core"
import { getHashString } from '../../libs/Utils'
import { useFuegoContext } from '@nandorojo/swr-firestore';
import Router from 'next/router'

const CreateRoom = props => {

	const [error, setError] = useState("")
	// @ts-ignore
	const { fuego } = useFuegoContext()
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
		const roomsRef = fuego.db.collection("rooms")
		const existing = await roomsRef.where("name", "==", roomName).get()
		if (!existing.empty) {
			setError(`room:${roomName} already exists`)
			return
		}
		const pwd = getHashString(password)
		try {
			await roomsRef.add({
				name: roomName,
				pwd
			})
			setError("")
			Router.push({
				pathname: `/admin/rooms/${roomName}`,
				query: { password, pwd }
			})
		} catch (error) {
			console.info(error);
			setError(error)
		}
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
					color="secondary"
				>部屋を作る</Button>
			</form>
			<span className="error">{error}</span>
		</>
	)

}

export default CreateRoom;
