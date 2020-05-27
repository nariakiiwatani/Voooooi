import { useState } from "react"
import Router from 'next/router'
import { getHashString } from '../libs/Utils';
import RoomForm from '../components/RoomForm';
import { userInfo } from 'os';

const Index = () => {

	const [error, setError] = useState("")

	const handleCreate = async ({ roomName, password }) => {
		const pwd = getHashString(password)
		const result = await fetch(`/api/rooms/${roomName}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json; charset=utf-8",
			},
			body: JSON.stringify({ pwd })
		})
		setError("")
		if (result.status === 201) {
			const response = (await result.json()).data
		}
		else {
			const response = await result.json()
			console.info("response(error)", response);
			setError(response.error)
		}
	}
	const handleEnter = async ({ roomName, password }) => {
		const pwd = getHashString(password)
		const response = await fetch(`/api/rooms/${roomName}?pwd=${pwd}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json; charset=utf-8",
			}
		})
		setError("")
		if (response.status === 200) {
			const result = (await response.json()).data
			Router.push({
				pathname: `/rooms/${roomName}`,
				query: { pwd }
			})
		}
		else {
			const result = await response.json()
			console.info("response(error)", result);
			setError(result.error)
		}
	}
	return (
		<div>
			<h1>Voext</h1>
			<RoomForm error={error} onEnter={handleEnter} onCreate={handleCreate} />
		</div>
	);
};

export default Index;
