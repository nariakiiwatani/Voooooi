import { createContext } from 'react';
import { useSessionStorage } from "react-use"

export const UserContext = createContext({
	user: { get: null, set: null },
	team: { get: null, set: null },
	token: { get: null, set: null }
});
const UserContextProvider = (props) => {
	const [user, setUser] = useSessionStorage("user", "");
	const [team, setTeam] = useSessionStorage("team", "");
	const [token, setToken] = useSessionStorage("token", "");
	return (
		<UserContext.Provider value={{
			user: { get: () => user, set: setUser },
			team: { get: () => team, set: setTeam },
			token: { get: () => token, set: setToken },
		}}>
			{props.children}
		</UserContext.Provider >
	)
}
export default UserContextProvider;