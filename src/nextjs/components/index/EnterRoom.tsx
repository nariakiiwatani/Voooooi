import { useState, useContext } from "react"
import { TextField, Button, makeStyles, Theme, createStyles, Modal, Fade } from "@material-ui/core"
import { getHashString, makeQueryString } from '../../libs/Utils'
import { fuego } from '@nandorojo/swr-firestore';
import Router from 'next/router'
import { UserContext } from '../contexts/UserContext';
import SelectTeam from './SelectTeam';
import classes from '*.module.css';


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

	const [formInput, setFormInput] = useState({
		roomName: "",
		password: "",
		userName: "",
	})
	const { roomName, password, userName } = formInput
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
		const response = await fetch(`/api/teams?${makeQueryString({
			room: roomName,
			pwd: password === "" ? "" : getHashString(password)
		})}`)
		if (!response.ok) {
			setError(response.statusText)
			return
		}
		const result = (await response.json()).data
		setTeams(result.teams)
		setOpenModal(true)
	}

	const [teams, setTeams] = useState([])
	const [openModal, setOpenModal] = useState(false)
	const handleCloseTeamSelect = () => {
		setOpenModal(false)
	}
	const handleTeamSelect = async teamId => {
		setError("")
		const response = await fetch(`/api/users/signup?${makeQueryString({
			room: roomName,
			pwd: password === "" ? "" : getHashString(password),
			name: userName,
			team: teamId
		})}`)
		if (!response.ok) {
			setError(response.statusText)
			return
		}
		const result = (await response.json()).data
		context.user.set(result.user.id)
		context.team.set(result.user.team)
		context.token.set(result.token)
		Router.push(`/rooms/${roomName}`)
	}

	const classes = useStyles();

	return (
		<>
			<form onSubmit={handleSubmit}>
				{createInput(["部屋名", "text", "roomName", roomName])}
				{createInput(["入室パスワード", "password", "password", password])}
				{createInput(["選手名", "text", "userName", userName])}
				<Button
					fullWidth
					type="submit"
					variant="contained"
					color="primary"
				>部屋に入る</Button>
			</form>
			<span className="error">{error}</span>
			<Modal
				className={classes.modal}
				open={openModal}
				onClose={handleCloseTeamSelect}
				closeAfterTransition
			>
				<Fade in={openModal}>
					<div className={classes.paper}>
						<h4>チームを選択して入室</h4>
						<SelectTeam teams={teams} onSelect={handleTeamSelect} />
					</div>
				</Fade>
			</Modal>
		</>
	)

}

export default EnterRoom;
