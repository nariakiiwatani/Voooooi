import { useState } from "react"
import Router from 'next/router'
import { getHashString } from '../libs/Utils';
import RoomForm from '../components/RoomForm';
import { userInfo } from 'os';

const Index = () => {

	const [error, setError] = useState("")

	const handleCreate = async ({ roomName, password }) => {
		const pwd = getHashString(password)
		const result = await fetch(`/api/rooms`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json; charset=utf-8",
			},
			body: JSON.stringify({ name: roomName, pwd })
		})
		setError("")
		if (result.status === 201) {
			const response = (await result.json()).data
			Router.push({
				pathname: `/admin/rooms/${roomName}`,
				query: { password, pwd }
			})
		}
		else {
			const response = await result.json()
			console.info("response(error)", response);
			setError(response.error)
		}
	}
	const handleEnter = async ({ roomName, password }) => {
		const pwd = getHashString(password)
		const response = await fetch(`/api/rooms?name=${roomName}&pwd=${pwd}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json; charset=utf-8",
			}
		})
		setError("")
		if (response.ok) {
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
