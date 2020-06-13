import { useState, useContext } from "react"
import { TextField, Select, MenuItem, Button, InputLabel, FormControl, Typography, ListItemIcon } from '@material-ui/core'
import { People } from "@material-ui/icons"
import { fuego, useCollection } from "@nandorojo/swr-firestore"
import { UserContext } from '../contexts/UserContext'
import * as firebase from "firebase"

const EnterUser = props => {
	const { room } = props
	const teams = useCollection<{ name: string, color: number[] }>(`rooms/${room.id}/teams`)
	const isTeamsValid = teams?.data?.length > 0
	const context = useContext(UserContext)

	const [formInput, setFormInput] = useState({
		name: "",
		teamId: "",
	})
	const { name, teamId } = formInput

	const handleSubmit = e => {
		e.preventDefault()
		const userInfo = {
			name,
			team: teamId,
			createdAt: firebase.firestore.FieldValue.serverTimestamp()
		}
		fuego.db.collection(`rooms/${room.id}/users`).add(userInfo)
			.then(data => {
				context.user.set(data.id);
				context.team.set(teamId);
			})
			.catch(e => { console.error(e) })
	}

	const handleChange = name => e => {
		setFormInput({
			...formInput,
			[name]: e.target.value
		})
	}
	const createInput = ([label, type, name, value, id = label]) => (
		<div key={id}>
			<TextField
				fullWidth
				label={label}
				type={type}
				name={name}
				value={value}
				onChange={handleChange(name)}
			/>
		</div>
	)
	return (
		<>
			<h3>名前とチームを入力してください</h3>
			<form onSubmit={handleSubmit}>
				{createInput(["名前", "text", "name", name])}
				<FormControl fullWidth>
					<InputLabel id="id-team-select">チーム</InputLabel>
					<Select
						labelId="id-team-select"
						id="team-select"
						value={teamId}
						onChange={handleChange("teamId")}
					>
						{isTeamsValid && teams.data.filter(t => t.id !== "admin").map((t, i) => {
							const cssProperty = {
								color: `rgb(${t.color.join(",")})`
							}
							return (
								<MenuItem value={t.id} key={i} >
									<ListItemIcon>
										<People style={cssProperty} />
									</ListItemIcon>
									<Typography variant="inherit">{t.name}</Typography>
								</MenuItem>
							)
						})}
					</Select>
				</FormControl>
				<Button
					type="submit"
					variant="contained"
					color="primary"
					fullWidth
				>
					入室
				</Button>
			</form>

		</>
	)
}

export default EnterUser