import { useState } from "react"
import { Tabs, Tab, Button, Modal, Fade, makeStyles, Theme, createStyles } from '@material-ui/core';
import MyLayout from '../components/Layout';
import EnterRoom from '../components/index/EnterRoom';
import CreateRoom from '../components/index/CreateRoom';
import About from '../components/index/About';

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

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		modal: {
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
		},
		paper: {
			backgroundColor: theme.palette.background.paper,
			border: '2px solid #000',
			boxShadow: theme.shadows[5],
			padding: theme.spacing(2, 4, 3),
		},
	}),
);
const Index = () => {
	const [tabSelect, setTabSelect] = useState(0)
	const handleTabSelect = (event, newValue) => {
		setTabSelect(newValue)
	}

	const classes = useStyles();
	const [openModal, setOpenModal] = useState(false)
	const handleOpenAbout = () => {
		setOpenModal(true)
	}
	const handleCloseAbout = () => {
		setOpenModal(false)
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
			<Button
				onClick={handleOpenAbout}
				color="primary"
			>
				Voooooi!（ゔぉーい！）について
			</Button>
			<Modal
				className={classes.modal}
				open={openModal}
				onClose={handleCloseAbout}
				closeAfterTransition
			>
				<Fade in={openModal}>
					<div className={classes.paper}>
						<About />
					</div>
				</Fade>
			</Modal>
		</MyLayout>
	);
};

export default Index;
