import { useState } from "react"
import { TextField, Button } from "@material-ui/core"

const RoomForm = props => {
	const { buttonProps } = props

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

	const handleSubmit = e => {
		e.preventDefault()
		props.onSubmit({
			roomName, password
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
					{...buttonProps}
				>{buttonProps.value}</Button>
			</form>
			<span className="error">{props.error}</span>
		</>
	)

}

export default RoomForm;
