import { useState } from "react"
import { Tabs, Tab, Button, Modal, Fade, makeStyles, Theme, createStyles } from '@material-ui/core';
import MyLayout from '../components/Layout';
import EnterRoom from '../components/index/EnterRoom';
import CreateRoom from '../components/index/CreateRoom';
import About from '../components/index/About';

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
		infoButton: {
			textTransform: "none"
		}
	}),
);
const Index = () => {
	const classes = useStyles();
	const [modalType, openModal] = useState("")
	const closeModal = () => { openModal("") }
	const isOpenModal = () => (modalType !== "")
	const ModalContent = props => (
		{
			about: <About />,
			create: <>
				<h4>新しい部屋を作る</h4>
				<CreateRoom />
			</>

		}[props.type] || <></>
	)
	return (
		<MyLayout title="Voooooi!（ゔぉーい！）">
			<EnterRoom />
			<Button
				fullWidth
				className={classes.infoButton}
				onClick={() => openModal("create")}
				color="primary"
			>
				新しい部屋を作る
			</Button>
			<Button
				fullWidth
				className={classes.infoButton}
				onClick={() => openModal("about")}
				color="primary"
			>
				Voooooi!（ゔぉーい！）について
			</Button>
			<Modal
				className={classes.modal}
				open={isOpenModal()}
				onClose={closeModal}
				closeAfterTransition
			>
				<Fade in={isOpenModal()}>
					<div className={classes.paper}>
						<ModalContent type={modalType} />
					</div>
				</Fade>
			</Modal>
		</MyLayout>
	);
};

export default Index;
