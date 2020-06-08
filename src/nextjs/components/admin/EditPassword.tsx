import { useState } from 'react'
import { TextField, Button } from '@material-ui/core'

const EditPassword = props => {
	const { label, onSubmit } = props
	const [formInput, setFormInput] = useState({
		password: ""
	})
	const { password } = formInput

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
		onSubmit(password)
	}
	return (
		<>
			<div>{label}</div>
			<form onSubmit={handleSubmit}>
				{createInput(["パスワード", "password", "password", password])}
				<Button
					fullWidth
					type="submit"
					color="primary"
				>
					設定
				</Button>
			</form>
		</>
	)
}

export default EditPassword