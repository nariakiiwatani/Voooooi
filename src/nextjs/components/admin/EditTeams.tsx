import MaterialTable from "material-table"
import { useCollection, fuego } from '@nandorojo/swr-firestore';
import { CompactPicker } from "react-color"
import * as firebase from "firebase"
import { Button } from '@material-ui/core';
import tableIcons from "../../libs/TableIcons"

const EditTeams = props => {
	const { roomName } = props
	const columns = [
		{ title: '名前', field: 'name' },
		{
			title: '色', field: 'color', initialEditValue: [255, 255, 255],
			render: ({ color }) => (
				<>
					<Button
						variant="outlined"
						disabled
						style={{
							backgroundColor: `rgb(${color.join(",")})`,
						}}
					>
						COLOR
					</Button>
				</>
			),
			editComponent: props => {
				const { value } = props
				return (<CompactPicker
					color={{ r: value[0], g: value[1], b: value[2] }}
					onChange={({ rgb }) => props.onChange([rgb.r, rgb.g, rgb.b])}
				/>)
			}
		}
	];
	const teams = useCollection(`rooms/${roomName}/teams`)

	return (
		<>
			{teams.data ? <MaterialTable
				icons={tableIcons}
				columns={columns}
				data={teams.data}
				editable={{
					onRowAdd: async newData => {
						await teams.add({
							...newData,
							createdAt: firebase.firestore.FieldValue.serverTimestamp()
						})
					},
					onRowUpdate: async (newData, oldData) => {
						const teamDoc = fuego.db.doc(`rooms/${roomName}/teams/${oldData.id}`)
						await teamDoc.update({
							name: newData.name,
							color: newData.color,
							updatedAt: firebase.firestore.FieldValue.serverTimestamp()
						})
						await teams.revalidate()
					},
					onRowDelete: async oldData => {
						const teamDoc = fuego.db.doc(`rooms/${roomName}/teams/${oldData.id}`)
						await teamDoc.delete()
						await teams.revalidate()
					}
				}}
			/> : ""}
		</>
	)
}

export default EditTeams