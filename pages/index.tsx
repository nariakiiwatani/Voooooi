import { useState } from "react"
import Router from 'next/router'
import TeamSelectionModal from "../components/TeamSelectionModal"
import { objectToArray, getHashString } from '../libs/Utils';
import EnterRoom from '../components/EnterRoom';
import RoomForm from '../components/RoomForm';

const Index = () => {

	const [error, setError] = useState("")

	const handleCreate = async ({ roomName, password }) => {
		const result = await fetch(`/api/rooms/${roomName}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json; charset=utf-8",
			},
			body: JSON.stringify({ password })
		})
		setError("")
		if (result.status === 200) {
			const response = (await result.json()).data
		}
		else {
			const response = await result.json()
			console.info("response(error)", response);
			setError(response.error)
		}
	}
	const handleEnter = async ({ roomName, password }) => {
		const result = await fetch(`/api/rooms/${roomName}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json; charset=utf-8",
			}
		})
		setError("")
		if (result.status === 200) {
			const response = (await result.json()).data
			Router.push(`/rooms/${roomName}`, {
				query: { pwd: getHashString(password) }
			})
		}
		else {
			const response = await result.json()
			console.info("response(error)", response);
			setError(response.error)
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
