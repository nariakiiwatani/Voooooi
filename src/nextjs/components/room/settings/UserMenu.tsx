const UserMenu = props => {
	const { user, team } = props
	return (
		<>
			<div>{user?.name}</div>
			<div>{team?.name}</div>
		</>
	)
}

export default UserMenu