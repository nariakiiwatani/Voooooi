import { useState, useEffect, useRef } from "react"
import Analyzer from '../libs/Analyzer'

const VoextInput = (props) => {
	const { onSubmit } = props
	const [talking, setTalking] = useState("")
	const [isInterim, setIsInterim] = useState(true)
	const [enableAnalyze, setEnableAnalyze] = useState(true)

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
		<form onSubmit={handleSubmit}>
			<input type="text" value={talking} onChange={handleChange} />
		</form>
	)
}

export default VoextInput;