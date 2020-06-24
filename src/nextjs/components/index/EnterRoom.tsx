import { useState, useContext, useMemo } from "react"
import { TextField, Button, makeStyles, Theme, createStyles, Modal, Fade } from "@material-ui/core"
import { getHashString, makeQueryString } from '../../libs/Utils'
import Router from 'next/router'
import { UserContext } from '../contexts/UserContext';
import SignUp from './SignUp';
import { useLocalStorage } from 'react-use';
import SignInByToken from './SignInByToken';


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
		}
	}),
);

const EnterRoom = props => {
	const [error, setError] = useState("")
	const context = useContext(UserContext)
	const [tokens, setTokens] = useLocalStorage<{ [room: string]: { [token: string]: any } }>("tokens", null)
	const someTokenValid = useMemo(() => (
		tokens && Object.values(tokens).some(v => Object.keys(v).length)
	), [tokens])

	const [formInput, setFormInput] = useState({
		roomName: "",
		password: "",
	})
	const { roomName, password } = formInput
	const handleChange = name => e => {
		setFormInput({
			...formInput,
			[name]: e.target.value
		})
	}
	const createInput = ([label, type, name, value, id = label]) => (
		<div key={id}>
			<TextField fullWidth
				type={type}
				label={label}
				name={name}
				value={value}
				onChange={handleChange(name)}
			/>
		</div>
	)

	const handleSubmit = async e => {
		e.preventDefault()
		setError("")
		openModal("teams")
	}

	const [modalType, openModal] = useState("")
	const closeModal = () => { openModal("") }
	const isOpenModal = () => (modalType !== "")
	const ModalContent = props => (
		{
			teams: (<>
				<h4>チームを選択して入室</h4>
				<SignUp room={roomName} pwd={getHashString(password)} />
			</>),
			tokens: (<>
				<h4>過去に入室済みの選手として入室</h4>
				<SignInByToken />
			</>)

		}[props.type] || <></>
	)

	const classes = useStyles();

	return (
		<>
			<form onSubmit={handleSubmit}>
				{createInput(["部屋名", "text", "roomName", roomName])}
				{createInput(["入室パスワード", "password", "password", password])}
				<Button
					fullWidth
					type="submit"
					variant="contained"
					color="primary"
				>部屋に入る</Button>
			</form>
			<span className="error">{error}</span>
			{someTokenValid ?
				<Button
					fullWidth
					onClick={() => { openModal("tokens") }}>
					過去に入室済みの選手として入室
				</Button> :
				<></>}
			<Modal
				className={classes.modal}
				open={isOpenModal()}
				onClose={() => { closeModal() }}
				closeAfterTransition
			>
				<Fade in={isOpenModal()}>
					<div className={classes.paper}>
						<ModalContent type={modalType} />
					</div>
				</Fade>
			</Modal>
		</>
	)

}

export default EnterRoom;
