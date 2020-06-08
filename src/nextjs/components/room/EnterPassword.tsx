import { useState } from "react"
import { TextField, Button } from '@material-ui/core'

const EnterPassword = props => {
	const { label, buttonText, onSubmit } = props
	const [formInput, setFormInput] = useState({
		password: ""
	})
	const { password } = formInput

	const handleSubmit = e => {
		e.preventDefault()
		onSubmit(password)
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
			<div>{label}</div>
			<form onSubmit={handleSubmit}>
				{createInput(["パスワード", "password", "password", password])}
				<Button
					type="submit"
					variant="contained"
					color="primary"
					fullWidth
				>
					{buttonText}
				</Button>
			</form>

		</>
	)
}

export default EnterPassword