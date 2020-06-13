import MaterialTable from "material-table"
import { useCollection, fuego } from '@nandorojo/swr-firestore';
import * as firebase from "firebase"
import { Button, FormControl, InputLabel, Select, MenuItem, ListItemIcon, Typography } from '@material-ui/core';
import tableIcons from "../../libs/TableIcons"
import { People } from '@material-ui/icons';

const EditMembers = props => {
	const { roomName } = props
	const teams = useCollection<{
		id: string,
		color: number[],
		name: string,
		createdAt: any
	}>(`rooms/${roomName}/teams`,
		{
			orderBy: ["createdAt", "asc"]
		}
	)
	const users = useCollection<{
		id: string,
		name: string,
		team: string
	}>(`rooms/${roomName}/users`)
	const columns = [
		{ title: '名前', field: 'name' },
		{
			title: 'チーム', field: 'team', initialEditValue: "",
			render: ({ team: id }) => {
				const team = teams.data.find(t => t.id == id)
				return (
					<>
						<Button
							variant="outlined"
							disabled
							style={{
								backgroundColor: `rgb(${team?.color.join(",")})`,
							}}
						>
							{team?.name || ""}
						</Button>
					</>
				)
			},
			editComponent: props => {
				const { value } = props
				return (
					<FormControl>
						<InputLabel id="team-selection">チーム</InputLabel>
						<Select
							labelId="team-selection"
							value={value}
							onChange={e => {
								props.onChange(e.target.value)
							}}
						>
							{teams.data.map(({ id, name, color }) => {
								return (
									<MenuItem
										key={id}
										value={id}
									>
										<ListItemIcon>
											<People
												style={{
													color: `rgb(${color.join(",")})`,
												}}
											/>
										</ListItemIcon>
										<Typography variant="inherit">{name}</Typography>
									</MenuItem>
								)
							})}
						</Select>
					</FormControl>
				)
			}
		}
	];

	return (
		<>
			{users.data && teams.data ?
				<MaterialTable
					icons={tableIcons}
					columns={columns}
					data={users.data}
					editable={{
						isDeletable: rowData => (rowData.id !== "admin"),
						onRowUpdate: async (newData: { name: string, team: string }, oldData: { id: string, team: string }) => {
							const userDoc = fuego.db.doc(`rooms/${roomName}/users/${oldData.id}`)
							await userDoc.update({
								name: newData.name,
								team: newData.team,
								updatedAt: firebase.firestore.FieldValue.serverTimestamp()
							})
							await users.revalidate()
						},
						onRowDelete: async (oldData: { id: string, team: string }) => {
							const userDoc = fuego.db.doc(`rooms/${roomName}/users/${oldData.id}`)
							await userDoc.delete()
							await users.revalidate()
						}
					}}
				/> : ""}
		</>
	)
}

export default EditMembers
