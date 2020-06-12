import MaterialTable from "material-table"
import { useCollection, fuego } from '@nandorojo/swr-firestore';
import * as firebase from "firebase"
import tableIcons from "../../../libs/TableIcons"

const EditNGWords = props => {
	const { roomName } = props
	const ngWords = useCollection<{
		text: string,
		replace: string,
		replaceWholeMessage: boolean,
		regexp: boolean,
		createdAt: firebase.firestore.FieldValue
	}>(
		`rooms/${roomName}/ngMessages`,
		{
			orderBy: ["createdAt", "asc"]
		}
	)
	const columns = [
		{ title: '対象テキスト', field: 'text' },
		{ title: "置換テキスト", field: "replace", initialEditValue: "---" },
		{ title: "正規表現", field: "regexp", type: "boolean", initialEditValue: false },
		{ title: "メッセージ全体を置き換え", field: "replaceWholeMessage", type: "boolean", initialEditValue: true }
	];

	return (
		<>
			<MaterialTable
				icons={tableIcons}
				columns={columns}
				data={ngWords.data}
				editable={{
					onRowAdd: async (newData) => {
						await ngWords.add({
							...newData,
							createdAt: firebase.firestore.FieldValue.serverTimestamp()
						})
					},
					onRowUpdate: async (newData, oldData) => {
						const doc = fuego.db.doc(`rooms/${roomName}/ngMessages/${oldData.id}`)
						await doc.update({
							text: newData.text,
							replace: newData.replace,
							regexp: newData.regexp,
							replaceWholeMessage: newData.replaceWholeMessage,
							updatedAt: firebase.firestore.FieldValue.serverTimestamp()
						})
						await ngWords.revalidate()
					},
					onRowDelete: async (oldData) => {
						const doc = fuego.db.doc(`rooms/${roomName}/ngMessages/${oldData.id}`)
						await doc.delete()
						await ngWords.revalidate()
					}
				}}
			/>
		</>
	)
}

export default EditNGWords
