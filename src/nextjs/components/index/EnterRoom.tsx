import { useState, useContext, useMemo } from "react"
import { TextField, Button, makeStyles, Theme, createStyles, Modal, Fade, Select } from "@material-ui/core"
import { getHashString, makeQueryString } from '../../libs/Utils'
import { fuego } from '@nandorojo/swr-firestore';
import Router from 'next/router'
import { UserContext } from '../contexts/UserContext';
import SelectTeam from './SelectTeam';
import classes from '*.module.css';
import { useLocalStorage } from 'react-use';
import SelectFromTokens from './SelectFromTokens';


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
	const [tokens, setTokens] = useLocalStorage<{ [room: string]: { token: string, user: any }[] }>("tokens", {})
	const someTokenValid = useMemo(() => (
		Object.values(tokens).some(v => v.length)
	), [tokens])

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
		openTeamModal(result.teams)
	}

	const [openModal, setOpenModal] = useState(false)
	const [modalContent, setModalContent] = useState(<></>)
	const openTeamModal = (teams) => {
		setModalContent(
			<>
				<h4>チームを選択して入室</h4>
				<SelectTeam teams={teams} onSelect={handleTeamSelect} />
			</>
		)
		setOpenModal(true)
	}
	const openTokenModal = (tokens) => {
		setModalContent(
			<>
				<h4>過去に入室済みの選手として入室</h4>
				<SelectFromTokens tokens={tokens} onSubmit={handleTokenSelect} />
			</>
		)
		setOpenModal(true)
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
		console.log(result)
		context.user.set(result.user.id)
		context.team.set(result.user.team)
		setTokens(prev => {
			const thisRooms = prev[roomName] !== undefined ?
				[...prev[roomName]] : []
			thisRooms.push({
				token: result.token,
				user: result.user
			})
			return {
				...prev,
				[roomName]: thisRooms
			}
		})
		Router.push(`/rooms/${roomName}`)
	}
	const handleTokenSelect = async ({ room, token }: { room: string, token: string }) => {
		setError("")
		const response = await fetch(`/api/users/signin?${makeQueryString({ room, token })}`)
		if (!response.ok) {
			setError(response.statusText)
			return
		}
		const result = (await response.json()).data
		context.user.set(result.user.id)
		context.team.set(result.user.team)
		Router.push(`/rooms/${room}`)
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
			{someTokenValid ?
				<Button
					fullWidth
					onClick={() => { openTokenModal(tokens) }}>
					過去に入室済みの選手として入室
				</Button> :
				<></>}
			<Modal
				className={classes.modal}
				open={openModal}
				onClose={() => { setOpenModal(false) }}
				closeAfterTransition
			>
				<Fade in={openModal}>
					<div className={classes.paper}>
						{modalContent}
					</div>
				</Fade>
			</Modal>
		</>
	)

}

export default EnterRoom;
