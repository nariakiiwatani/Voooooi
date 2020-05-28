import React from 'react'
import { AppBar } from '@material-ui/core'

const MyLayout = props => {
	return (
		<React.Fragment>
			<AppBar position="static">
				<h1>Voext Chat</h1>
			</AppBar>
			{props.children}
		</React.Fragment>

	)
}

export default MyLayout