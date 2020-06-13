import { useDocument } from '@nandorojo/swr-firestore'
import { Checkbox, FormControlLabel, List, ListItem } from '@material-ui/core'
import { useState, useEffect } from 'react'


const ViewSettings = props => {
	const { roomName } = props

	const settings = useDocument<{
		combinedTimeline: boolean,
		muteOtherTeams: boolean
	}>(`rooms/${roomName}/settings/view`)
	const [loadedInitialData, setLoadedInitialData] = useState(false)

	const [state, setState] = useState({
		combinedTimeline: false,
		muteOtherTeams: false
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

	const controls = {
		combinedTimeline: {
			type: "boolean",
			label: "全チームのタイムラインを統合"
		},
		muteOtherTeams: {
			type: "boolean",
			label: "自分のチーム以外をミュート"
		}
	}
	return (
		<>
			<List>
				{Object.entries(controls).map(([name, { type, label }]) => {
					switch (type) {
						case "boolean":
							return (
								<FormControlLabel
									control={
										<Checkbox
											checked={state[name]}
											onChange={handleChange(name)}
										/>
									}
									label={label}
								/>
							)
					}
				})
					.map((element, index) => (<ListItem key={index}>{element}</ListItem>))
				}
			</List>
		</>
	)
}

export default ViewSettings