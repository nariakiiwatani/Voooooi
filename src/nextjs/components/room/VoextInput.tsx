import { useState, useEffect, useRef } from "react"
import Analyzer from '../../libs/Analyzer'
import { FormControl, InputAdornment, OutlinedInput, IconButton } from '@material-ui/core'
import { Mic, MicOff } from "@material-ui/icons"

const VoextInput = (props) => {
	const { onSubmit, enabled } = props
	const [talking, setTalking] = useState("")
	const [isInterim, setIsInterim] = useState(true)
	const [enableVoice, setEnableVoice] = useState(true)

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
		return () => {
			analyzer.stop()
		}
	}, [])
	useEffect(() => {
		const result = enableVoice && enabled
		analyzer.setContinuous(result)
		result ? analyzer.start() : analyzer.stop()
	}, [enableVoice, enabled])
	const handleChangeVoiceEnabled = e => {
		setEnableVoice(!enableVoice)
	}

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
								<IconButton
									onClick={handleChangeVoiceEnabled}
								>
									{enableVoice ? <Mic /> : <MicOff />}
								</IconButton>
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