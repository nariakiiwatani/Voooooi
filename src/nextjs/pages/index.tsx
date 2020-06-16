import { useState } from "react"
import { Tabs, Tab } from '@material-ui/core';
import MyLayout from '../components/Layout';
import EnterRoom from '../components/index/EnterRoom';
import CreateRoom from '../components/index/CreateRoom';

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
	const [tabSelect, setTabSelect] = useState(0)

	const handleTabSelect = (event, newValue) => {
		setTabSelect(newValue)
	}

	return (
		<MyLayout title="Voooooi!（ゔぉーい！）">
			<Tabs centered
				value={tabSelect}
				onChange={handleTabSelect}
				variant="fullWidth"
			>
				<Tab label="部屋に入る" />
				<Tab label="部屋を作る" />
			</Tabs>
			<TabPanel value={tabSelect} index={0}>
				<EnterRoom />
			</TabPanel>
			<TabPanel value={tabSelect} index={1}>
				<CreateRoom />
			</TabPanel>
		</MyLayout>
	);
};

export default Index;
