import { createContext, useState } from 'react';

export const UserContext = createContext({
	user: null,
	team: null,
	room: null,
	setUser: null,
	setTeam: null,
	setRoom: null,
});
const UserContextProvider = (props) => {
	const [user, setUser] = useState({});
	const [team, setTeam] = useState({});
	const [room, setRoom] = useState({});
	const [password, setPassword] = useState({});
	return (
		<UserContext.Provider value={{
			user, setUser,
			team, setTeam,
			room, setRoom,
		}}>
			{props.children}
		</UserContext.Provider>
	)
}
export default UserContextProvider;