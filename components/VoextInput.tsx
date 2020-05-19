import { useState } from "react"

const VoextInput = (props) => {
	const { onSubmit } = props
	const [talking, setTalking] = useState("")

	const handleChange = e => {
		setTalking(e.target.value)
	}
	const handleSubmit = e => {
		e.preventDefault()
		onSubmit(talking)
	}
	return (
		<form onSubmit={handleSubmit}>
			<input type="text" value={talking} onChange={handleChange} />
		</form>
	)
}

export default VoextInput;