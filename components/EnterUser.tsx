import { useState } from "react"
const EnterUser = props => {
	const [formInput, setFormInput] = useState({
		name: "",
		team: ""
	})
	const { name, team } = formInput
	const roomId = props.roomId

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
	const createInput = ([label, type, name, value]) => (
		<div>
			<span>{label}</span><input type={type} name={name} value={value} onChange={handleChange(name)} />
		</div>
	)
	return (
		<>
			<form onSubmit={handleSubmit}>
				{createInput(["名前", "text", "name", name])}
				{createInput(["チーム", "text", "team", team])}
			</form>
		</>
	)
}

export default EnterUser