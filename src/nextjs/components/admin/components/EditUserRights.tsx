import { useDocument } from '@nandorojo/swr-firestore'
import { useState, useEffect } from 'react'
import { List, FormControlLabel, Checkbox, ListItem } from '@material-ui/core'

const EditUserRights = props => {
	const { roomName } = props

	const settings = useDocument<{
		allowPost: boolean,
	}>(`rooms/${roomName}/settings/rights`)
	const [loadedInitialData, setLoadedInitialData] = useState(false)

	const [state, setState] = useState({
		allowPost: true,
	})
	useEffect(() => {
		if (loadedInitialData) {
			setState(settings.data)
		}
	}, [loadedInitialData])
	useEffect(() => {
		settings.set({
			allowPost: state.allowPost
		})
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
		allowPost: {
			type: "boolean",
			label: "投稿を許可"
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

export default EditUserRights