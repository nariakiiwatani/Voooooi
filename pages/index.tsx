import { useState } from "react"
import Router from 'next/router'
import { getHashString } from '../libs/Utils';
import RoomForm from '../components/RoomForm';
import { AppBar, Tabs, Tab, Paper } from '@material-ui/core';

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

	const handleTabSelect = (event, newValue) => {
		setTabSelect(newValue)
	}
	const handleCreate = async ({ roomName, password }) => {
		const pwd = getHashString(password)
		const response = await fetch(`/api/rooms`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json; charset=utf-8",
			},
			body: JSON.stringify({ name: roomName, pwd })
		})
		setError("")
		if (response.ok) {
			const result = (await response.json()).data
			Router.push({
				pathname: `/admin/rooms/${roomName}`,
				query: { password, pwd }
			})
		}
		else {
			const result = await response.json()
			console.info("response(error)", response);
			setError(result.error)
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
			<AppBar position="static">
				<h1>Voext Chat</h1>
			</AppBar>
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
		</div>
	);
};

export default Index;
