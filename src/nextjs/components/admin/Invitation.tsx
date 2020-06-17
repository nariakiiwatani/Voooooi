import EditPassword from './EditPassword'
import { Button, Typography, Card, CardContent, CardHeader, CardActions, IconButton, makeStyles, Snackbar, Popper, Fade, Paper, createStyles } from '@material-ui/core'
import { useClipboard } from "use-clipboard-copy"
import { getHashString } from "../../libs/Utils"
import firebase from 'firebase'
import { Link, OpenInNew, Done, Close } from '@material-ui/icons'
import { useRef, useState } from 'react'

const useStyle = makeStyles(theme => createStyles({
	lowAttentionButton: {
		textTransform: "none"
	},
	buttonFollowsText: {
		textTransform: "none",
		marginLeft: 12
	},
	popup: {
		padding: theme.spacing(2),
	}
}))

const Invitation = props => {
	const { roomRef } = props
	const clipboard = useClipboard({
		copiedTimeout: 2000,
		onSuccess: () => {
			setOpenPopup(true)
			setPopupText("コピーしました")
		}
	})
	const handleChangePassword = password => {
		const pwd = getHashString(password)
		roomRef.update({
			userPassword: pwd,
			updatedAt: firebase.firestore.FieldValue.serverTimestamp()
		})
		setOpenPasswordEdit(false)
		setOpenPopup(true)
		setPopupText("パスワードを変更しました")
	}
	const classes = useStyle()
	const url = `${origin}/rooms/${roomRef.data.id}`
	const urlWithPassword = `${url}?pwd=${roomRef.data.userPassword}`
	const popperAnchor = useRef()
	const [openPasswordEdit, setOpenPasswordEdit] = useState(false)
	const [openPopup, setOpenPopup] = useState(false)
	const [popupText, setPopupText] = useState("")
	const handleClose = (event: React.SyntheticEvent | React.MouseEvent, reason?: string) => {
		if (reason === 'clickaway') {
			return;
		}
		setOpenPopup(false);
	};
	return (
		<>
			<Card>
				<CardHeader title="入室URL" />
				<CardContent ref={popperAnchor}>
					<div>
						<Typography display="inline">{url}</Typography>
						<Button
							className={classes.buttonFollowsText}
							aria-label="open URL in new window"
							startIcon={<OpenInNew />}
							size="small"
							onClick={() => window.open(urlWithPassword, '_blank')}
						>
							open in new window
					</Button>
					</div>
					<div>
						{openPasswordEdit ?
							<EditPassword label="" onSubmit={handleChangePassword} onCancel={() => setOpenPasswordEdit(false)} /> :
							<Button onClick={() => setOpenPasswordEdit(true)}>パスワードを変更</Button>
						}
					</div>
				</CardContent>
				<CardActions>
					<Button
						className={classes.lowAttentionButton}
						aria-label="copy URL"
						startIcon={<Link />}
						size="small"
						onClick={() => clipboard.copy(url)}
					>
						copy URL to Clipboard
					</Button>
					<Button
						className={classes.lowAttentionButton}
						aria-label="copy URL with password"
						startIcon={<Link />}
						size="small"
						onClick={() => clipboard.copy(urlWithPassword)}
					>
						copy URL to Clipboard(with password)
					</Button>
				</CardActions>
			</Card>
			<Snackbar
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'center',
				}}
				open={openPopup}
				autoHideDuration={6000}
				onClose={handleClose}
				message={popupText}
				action={
					<>
						<IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
							<Close fontSize="small" />
						</IconButton>
					</>
				}
			/>
		</>
	)
}

export default Invitation