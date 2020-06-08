import { useState } from "react"
import { TextField, Button } from "@material-ui/core"
import { getHashString } from '../../libs/Utils'
import { fuego } from '@nandorojo/swr-firestore';
import Router from 'next/router'
import * as firebase from "firebase"

const CreateRoom = props => {

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
		const roomRef = fuego.db.doc(`rooms/${roomName}`)

		if ((await roomRef.get()).exists) {
			setError(`room:${roomName} already exists`)
			return
		}
		const pwd = getHashString(password)
		try {
			await roomRef.set({
				adminPassword: pwd,
				userPassword: "",
				createdAt: firebase.firestore.FieldValue.serverTimestamp()
			})
			const teamsRef = roomRef.collection("teams");
			[
				{ "name": "赤チーム", "color": [255, 0, 0] },
				{ "name": "青チーム", "color": [0, 0, 255] },
				{ "name": "黄チーム", "color": [255, 255, 0] },
				{ "name": "白チーム", "color": [255, 255, 255] },
			].forEach(t => {
				teamsRef.add({
					...t,
					createdAt: firebase.firestore.FieldValue.serverTimestamp()
				})
			})
			setError("")
			Router.push({
				pathname: `/admin/rooms/${roomName}`,
				query: { pwd }
			})
		} catch (e) {
			console.info(e);
			setError("部屋情報の作成に失敗")
		}
	}

	return (
		<>
			<form onSubmit={handleSubmit}>
				{createInput(["部屋名", "text", "roomName", roomName])}
				{createInput(["管理パスワード", "password", "password", password])}
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
