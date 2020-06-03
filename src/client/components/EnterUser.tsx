import { useState } from "react"
import { TextField, Select, MenuItem, Button, InputLabel, FormControl, Typography, Box, ListItemIcon } from '@material-ui/core'
import { People } from "@material-ui/icons"
import Color from 'color'
import { useCollection } from "@nandorojo/swr-firestore"

const EnterUser = props => {
	const { teams } = props
	const [formInput, setFormInput] = useState({
		name: "",
		team: null
	})
	const { name, team } = formInput

	const handleSubmit = e => {
		e.preventDefault()
		props.onSubmit({ name, team })
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
						value={team}
						onChange={handleChange("team")}
					>
						{teams.map((t, i) => {
							const cssProperty = {
								color: new Color(t.color.color).toString()
							}
							return <MenuItem value={t} key={i} >
								<ListItemIcon>
									<People style={cssProperty} />
								</ListItemIcon>
								<Typography variant="inherit">{t.name}</Typography>
							</MenuItem>
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