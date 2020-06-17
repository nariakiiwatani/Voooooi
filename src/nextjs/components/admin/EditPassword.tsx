import { useState } from 'react'
import { TextField, Button, IconButton } from '@material-ui/core'
import { Done, Close } from '@material-ui/icons'

const EditPassword = props => {
	const { label, onSubmit, onCancel } = props
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
			<TextField
				type={type}
				label={label}
				name={name}
				value={value}
				onChange={handleChange(name)}
				autoFocus
			/>
		</div>
	)

	const handleSubmit = e => {
		e.preventDefault()
		onSubmit(password)
	}
	const handleCancel = e => {
		e.preventDefault()
		onCancel()
	}
	return (
		<>
			<div>{label}</div>
			<form onSubmit={handleSubmit}>
				<div style={{ display: 'inline-flex' }}>
					<div>
						{createInput(["パスワードを変更", "password", "password", password])}
					</div>
					<div style={{ alignSelf: 'center' }}>
						<IconButton
							onClick={handleSubmit}
							color="primary"
							size="small"
						>
							<Done />
						</IconButton>
					</div>
					{onCancel ?
						<div style={{ alignSelf: 'center' }}>
							<IconButton
								onClick={handleCancel}
								size="small"
							>
								<Close />
							</IconButton>
						</div> : <></>}
				</div>

			</form>
		</>
	)
}

export default EditPassword