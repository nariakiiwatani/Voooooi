import { createContext, useState } from 'react';
import { useSessionStorage } from "react-use"

export const UserContext = createContext({
	user: null,
	team: null,
	setUser: null,
	setTeam: null,
});
const UserContextProvider = (props) => {
	const [user, setUser] = useSessionStorage("user", {});
	const [team, setTeam] = useSessionStorage("team", {});
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