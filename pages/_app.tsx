import UserContextProvider from '../components/contexts/UserContext';

function MyApp({ Component, pageProps }) {
	return (
		<UserContextProvider>
			<Component {...pageProps} />
		</UserContextProvider>
	)
}

export default MyApp