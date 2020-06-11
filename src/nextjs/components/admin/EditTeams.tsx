import MaterialTable from "material-table"
import { useCollection, fuego } from '@nandorojo/swr-firestore';
import { CompactPicker } from "react-color"
import * as firebase from "firebase"

import AddBox from '@material-ui/icons/AddBox';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import { forwardRef, useState } from 'react';
import { ArrowUpward } from '@material-ui/icons';
import { Button } from '@material-ui/core';

const tableIcons = {
	Add: forwardRef((props, ref: React.Ref<SVGSVGElement>) => <AddBox {...props} ref={ref} />),
	Check: forwardRef((props, ref: React.Ref<SVGSVGElement>) => <Check {...props} ref={ref} />),
	Clear: forwardRef((props, ref: React.Ref<SVGSVGElement>) => <Clear {...props} ref={ref} />),
	Delete: forwardRef((props, ref: React.Ref<SVGSVGElement>) => <DeleteOutline {...props} ref={ref} />),
	DetailPanel: forwardRef((props, ref: React.Ref<SVGSVGElement>) => <ChevronRight {...props} ref={ref} />),
	Edit: forwardRef((props, ref: React.Ref<SVGSVGElement>) => <Edit {...props} ref={ref} />),
	Export: forwardRef((props, ref: React.Ref<SVGSVGElement>) => <SaveAlt {...props} ref={ref} />),
	Filter: forwardRef((props, ref: React.Ref<SVGSVGElement>) => <FilterList {...props} ref={ref} />),
	FirstPage: forwardRef((props, ref: React.Ref<SVGSVGElement>) => <FirstPage {...props} ref={ref} />),
	LastPage: forwardRef((props, ref: React.Ref<SVGSVGElement>) => <LastPage {...props} ref={ref} />),
	NextPage: forwardRef((props, ref: React.Ref<SVGSVGElement>) => <ChevronRight {...props} ref={ref} />),
	PreviousPage: forwardRef((props, ref: React.Ref<SVGSVGElement>) => <ChevronLeft {...props} ref={ref} />),
	ResetSearch: forwardRef((props, ref: React.Ref<SVGSVGElement>) => <Clear {...props} ref={ref} />),
	Search: forwardRef((props, ref: React.Ref<SVGSVGElement>) => <Search {...props} ref={ref} />),
	SortArrow: forwardRef((props, ref: React.Ref<SVGSVGElement>) => <ArrowUpward {...props} ref={ref} />),
	ThirdStateCheck: forwardRef((props, ref: React.Ref<SVGSVGElement>) => <Remove {...props} ref={ref} />),
	ViewColumn: forwardRef((props, ref: React.Ref<SVGSVGElement>) => <ViewColumn {...props} ref={ref} />)
};



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
					onRowDelete: oldData =>
						new Promise((resolve, reject) => {
							setTimeout(() => {
								// const dataDelete = [...data];
								// const index = oldData.tableData.id;
								// dataDelete.splice(index, 1);
								// setData([...dataDelete]);

								resolve()
							}, 1000)
						}),
				}
				}
			/> : ""}
		</>
	)
}

export default EditTeams