import { useState, useEffect, useRef } from "react"
import Analyzer from '../../libs/Analyzer'
import { FormControl, InputAdornment, OutlinedInput } from '@material-ui/core'
import { Mic } from "@material-ui/icons"

const VoextInput = (props) => {
	const { onSubmit } = props
	const [talking, setTalking] = useState("")
	const [isInterim, setIsInterim] = useState(true)

	const handleInterim = text => {
		setIsInterim(true)
		setTalking(text)
	}
	const handleFinish = text => {
		setIsInterim(false)
		setTalking(text)
		onSubmit(text)
		setTimeout(() => {
			setTalking("")
		}, 500)
	}

	const handleInterimRef = useRef(handleInterim)
	const handleFinishRef = useRef(handleFinish)
	const [analyzer] = useState(() => new Analyzer(handleFinishRef, handleInterimRef))
	useEffect(() => {
		analyzer.start()
	}, [])
	const handleChange = e => {
		setTalking(e.target.value)
	}
	const handleSubmit = e => {
		e.preventDefault()
		onSubmit(talking)
		setTalking("")
	}
	return (
		<div style={props.style}>
			<form onSubmit={handleSubmit}>
				<FormControl
					margin="dense"
					fullWidth
				>
					<OutlinedInput
						type="text"
						startAdornment={
							<InputAdornment
								position="start"
							>
								<Mic />
							</InputAdornment>
						}
						value={talking}
						autoFocus
						onChange={handleChange}
						inputProps={{
							className: "input"
						}}

					/>
				</FormControl>
			</form>
			<style jsx global>{`
			.input {
				position: relative;
				display: block;
				color: ${isInterim ? "gray" : "black"};
				text-align: center;
			}
			`}</style>
		</div>
	)
}

export default VoextInput;