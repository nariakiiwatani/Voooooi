import { useContext } from 'react'
import { UserContext } from '../../contexts/UserContext'
import { Button } from '@material-ui/core'

const ExitMenu = props => {
	const context = useContext(UserContext)

	const handleClick = e => {
		context.clear()
	}
	return (
		<Button
			variant="contained"
			color="secondary"
			onClick={handleClick}
		>
			退室する
		</Button>
	)
}

export default ExitMenu