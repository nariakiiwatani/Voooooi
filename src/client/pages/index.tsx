import { useState } from "react"
import Router from 'next/router'
import { getHashString } from '../libs/Utils';
import RoomForm from '../components/RoomForm';
import { AppBar, Tabs, Tab, Paper } from '@material-ui/core';
import MyLayout from '../components/Layout';
import { useFuegoContext } from '@nandorojo/swr-firestore';

function TabPanel(props) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{
				value === index && (<div>{children}</div>)
			}
		</div>
	);
}
const Index = () => {
	const [error, setError] = useState("")
	const [tabSelect, setTabSelect] = useState(0)
	// @ts-ignore
	const { fuego } = useFuegoContext()

	const handleTabSelect = (event, newValue) => {
		setTabSelect(newValue)
	}
	const handleCreate = async ({ roomName, password }) => {
		const roomsRef = fuego.db.collection("rooms")

		const existing = await roomsRef.where("name", "==", roomName).get()
		if (!existing.empty) {
			setError(`room:${roomName} already exists`)
			return
		}
		const pwd = getHashString(password)
		try {
			await roomsRef.add({
				name: roomName,
				pwd
			})
			setError("")
			Router.push({
				pathname: `/admin/rooms/${roomName}`,
				query: { password, pwd }
			})
		} catch (error) {
			console.info(error);
			setError(error)
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
		<MyLayout title="Voext Chat">
			<Tabs centered
				value={tabSelect}
				onChange={handleTabSelect}
				variant="fullWidth"
			>
				<Tab label="部屋に入る" />
				<Tab label="部屋を作る" />
			</Tabs>
			<TabPanel value={tabSelect} index={0}>
				<RoomForm
					error={error}
					onSubmit={handleEnter}
					buttonProps={{
						value: "部屋に入る",
						variant: "contained",
						color: "primary"
					}}
				/>
			</TabPanel>
			<TabPanel value={tabSelect} index={1}>
				<RoomForm
					error={error}
					onSubmit={handleCreate}
					buttonProps={{
						value: "部屋を作る",
						variant: "contained",
						color: "secondary"
					}}
				/>
			</TabPanel>
		</MyLayout>
	);
};

export default Index;
