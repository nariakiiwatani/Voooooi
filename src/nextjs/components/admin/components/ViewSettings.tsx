import { useDocument } from '@nandorojo/swr-firestore'
import { Checkbox, FormControlLabel } from '@material-ui/core'
import { useState, useEffect } from 'react'


const ViewSettings = props => {
	const { roomName } = props

	const settings = useDocument<{
		combinedTimeline: boolean
	}>(`rooms/${roomName}/settings/view`)
	const [loadedInitialData, setLoadedInitialData] = useState(false)

	const [state, setState] = useState({
		combinedTimeline: false
	})
	useEffect(() => {
		if (loadedInitialData) {
			setState(settings.data)
		}
	}, [loadedInitialData])
	useEffect(() => {
		settings.set(state)
	}, [state])
	const handleChange = name => e => {
		setState(state => ({
			...state,
			[name]: e.target.value || e.target.checked
		}))
	}

	if (!settings.data) {
		return <div>fetching settings data...</div>
	}
	if (!loadedInitialData) {
		setLoadedInitialData(true)
	}

	return (
		<>
			<FormControlLabel
				control={
					<Checkbox
						checked={state.combinedTimeline}
						onChange={handleChange("combinedTimeline")}
					/>
				}
				label="全チームのタイムラインを統合"
			/>
		</>
	)
}

export default ViewSettings