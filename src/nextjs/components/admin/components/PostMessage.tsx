import { useDocument, fuego } from '@nandorojo/swr-firestore'
import { useState, useEffect } from 'react'
import { List, FormControlLabel, Checkbox, ListItem, TextField, Button } from '@material-ui/core'
import { CompactPicker } from "react-color"
import * as firebase from "firebase"

const PostMessage = props => {
	const { roomName } = props
	const adminId = "admin"
	const user = useDocument<{ name: string }>(`rooms/${roomName}/users/${adminId}`)
	const team = useDocument<{ color: number[] }>(`rooms/${roomName}/teams/${adminId}`)
	const [state, setState] = useState({
		name: "名前",
		color: [0, 0, 0],
		message: ""
	})

	useEffect(() => {
		if (!user.data) return
		setState(state => ({
			...state,
			name: user.data?.name
		}))
	}, [user.data])
	useEffect(() => {
		if (!team.data) return
		setState(state => ({
			...state,
			color: team.data?.color
		}))
	}, [team.data])

	if (!user?.data || !team?.data) {
		return <div>fetching</div>
	}

	const handleChangeValue = name => e => {
		e.persist()
		setState(state => ({
			...state,
			[name]: e.target.value
		}))
	}
	const handleChangeChecked = name => e => {
		e.persist()
		setState(state => ({
			...state,
			[name]: e.target.checked
		}))
	}
	const handleChangeColor = name => ({ rgb }) => {
		e.persist()
		setState(state => ({
			...state,
			[name]: [rgb.r, rgb.g, rgb.b]
		}))
	}
	const handleSubmit = e => {
		e.preventDefault()
		user.update({ name: state.name })
		team.update({ color: state.color })
		fuego.db.collection(`rooms/${roomName}/messages`).add({
			room: roomName,
			user: adminId,
			team: adminId,
			text: state.message,
			createdAt: firebase.firestore.FieldValue.serverTimestamp()
		})
	}

	const controls = {
		name: {
			type: "text",
			label: "表示名",
			handle: handleChangeValue
		},
		color: {
			type: "color",
			label: "色",
			handle: handleChangeColor
		},
		message: {
			type: "text",
			label: "メッセージ",
			handle: handleChangeValue
		},
		submit: {
			type: "submit",
			label: "投稿"
		}
	}
	return (
		<>
			<List>
				<form onSubmit={handleSubmit}>
					{Object.entries(controls).map(([name, { type, label, handle }], index) => {
						switch (type) {
							case "boolean":
								return (
									<FormControlLabel
										control={
											<Checkbox
												checked={state[name]}
												onChange={handle(name)}
											/>
										}
										label={label}
									/>
								)
							case "text":
								return (
									<TextField
										label={label}
										value={state[name]}
										onChange={handle(name)}
									/>
								)
							case "color":
								return (
									<CompactPicker
										color={{ r: state[name][0], g: state[name][1], b: state[name][2] }}
										onChange={handle(name)}
									/>
								)
							case "submit":
								return (
									<Button
										color="primary"
										variant="contained"
										type="submit"
									>
										{label}
									</Button>
								)
						}
					})
						.map((element, index) => (<ListItem key={index}>{element}</ListItem>))
					}
				</form>
			</List>
		</>
	)
}

export default PostMessage