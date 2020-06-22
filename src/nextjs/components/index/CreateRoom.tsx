import { useState } from "react"
import { TextField, Button } from "@material-ui/core"
import { getHashString } from '../../libs/Utils'
import { fuego } from '@nandorojo/swr-firestore';
import Router from 'next/router'
import * as firebase from "firebase"

const createDefaultRoom = async (roomRef) => {
	const teamsRef = roomRef.collection("teams");
	await teamsRef.doc("admin").set({
		name: "管理者",
		color: [0, 0, 0],
		createdAt: firebase.firestore.FieldValue.serverTimestamp()
	});
	[
		{ "name": "赤チーム", "color": [255, 0, 0] },
		{ "name": "青チーム", "color": [0, 0, 255] },
		{ "name": "黄チーム", "color": [255, 255, 0] },
		{ "name": "白チーム", "color": [255, 255, 255] },
	].forEach(async t => {
		await teamsRef.add({
			...t,
			createdAt: firebase.firestore.FieldValue.serverTimestamp()
		})
	});
	await roomRef.collection("users").doc("admin").set({
		name: "admin",
		team: "admin",
		createdAt: firebase.firestore.FieldValue.serverTimestamp()
	});
	await roomRef.collection("settings").doc("view").set({
		combinedTimeline: false,
		muteOtherTeams: false,
		createdAt: firebase.firestore.FieldValue.serverTimestamp()
	});
	await roomRef.collection("settings").doc("rights").set({
		allowPost: true,
		createdAt: firebase.firestore.FieldValue.serverTimestamp()
	});
}

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
			createDefaultRoom(roomRef)

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
					type="submit"
					variant="contained"
					color="secondary"
				>部屋を作る</Button>
			</form>
			<span className="error">{error}</span>
		</>
	)

}

export default CreateRoom;
