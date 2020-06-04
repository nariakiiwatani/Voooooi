import { createContext, useState } from 'react';

export const UserContext = createContext({
	user: null,
	team: null,
	setUser: null,
	setTeam: null,
});
const UserContextProvider = (props) => {
	const [user, setUser] = useState({});
	const [team, setTeam] = useState({});
	return (
		<UserContext.Provider value={{
			user, setUser,
			team, setTeam,
		}}>
			{props.children}
		</UserContext.Provider>
	)
}
export default UserContextProvider;