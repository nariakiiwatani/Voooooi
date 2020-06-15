import EditPassword from './EditPassword'
import { Button } from '@material-ui/core'
import { useDocument } from '@nandorojo/swr-firestore'
import { useClipboard } from "use-clipboard-copy"
import { getHashString } from "../../libs/Utils"
import firebase from 'firebase'

const EditRoom = props => {
	const { roomRef } = props
	const clipboard = useClipboard()
	const handleChangePassword = password => {
		const pwd = getHashString(password)
		roomRef.update({
			userPassword: pwd,
			updatedAt: firebase.firestore.FieldValue.serverTimestamp()
		})
	}
	return (
		<>
			<EditPassword label="入室パスワードを設定" onSubmit={handleChangePassword} />
			<form>
				<Button
					variant="contained"
					onClick={() => {
						clipboard.copy(`${origin}/rooms/${roomRef.data.id}?pwd=${roomRef.data.userPassword}`)
					}}
				>
					パスワードを含む入室URLをクリップボードにコピー
					</Button>
				<Button
					variant="contained"
					onClick={() => {
						clipboard.copy(`${origin}/admin/rooms/${roomRef.data.id}?&pwd=${roomRef.data.adminPassword}`)
					}}
				>
					管理画面（ここ）のURLをクリップボードにコピー
					</Button>
			</form>
		</>
	)
}

export default EditRoom