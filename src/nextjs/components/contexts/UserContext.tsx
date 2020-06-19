import { createContext } from 'react';
import { useSessionStorage } from "react-use"

export const UserContext = createContext({
	user: { get: () => String(), set: (v: string) => { } },
	team: { get: () => String(), set: (v: string) => { } },
	token: { get: () => String(), set: (v: string) => { } },
	clear: () => { },
});
const UserContextProvider = (props) => {
	const [user, setUser] = useSessionStorage("user", "");
	const [team, setTeam] = useSessionStorage("team", "");
	const [token, setToken] = useSessionStorage("token", "");
	const clear = () => {
		setUser("")
		setTeam("")
		setToken("")
	}
	return (
		<UserContext.Provider value={{
			user: { get: () => user, set: setUser },
			team: { get: () => team, set: setTeam },
			token: { get: () => token, set: setToken },
			clear
		}}>
			{props.children}
		</UserContext.Provider >
	)
}
export default UserContextProvider;