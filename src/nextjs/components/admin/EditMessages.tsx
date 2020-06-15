import { useCollection } from '@nandorojo/swr-firestore';
import { ListItemIcon, List, ListItem, ListItemText, Divider, Grid, Paper } from '@material-ui/core';
import { useState } from 'react';
import { ViewList } from "@material-ui/icons"
import ViewSettings from './components/ViewSettings';
import EditNGWords from './components/EditNGWords';
import PostMessage from './components/PostMessage';
import EditUserRights from './components/EditUserRights';

const EditMessages = props => {
	const { roomRef } = props

	const [selected, setSelected] = useState("view")
	const handleMenuItemClick = name => {
		setSelected(name)
	}

	const menus = {
		view: {
			title: "表示切り替え",
			icon: <ViewList />,
			content: <ViewSettings roomRef={roomRef} />
		},
		ngw: {
			title: "NGワード",
			icon: <ViewList />,
			content: <EditNGWords roomRef={roomRef} />
		},
		post: {
			title: "管理者メッセージ",
			icon: <ViewList />,
			content: <PostMessage roomRef={roomRef} />
		},
		rights: {
			title: "権限",
			icon: <ViewList />,
			content: <EditUserRights roomRef={roomRef} />
		}
	}

	return (
		<Grid container spacing={2}>
			<Grid item xs={3}>
				<Paper>
					<List component="nav">
						{Object.entries(menus).map(([k, v], i) => (
							<ListItem
								key={i}
								button
								selected={selected === k}
								onClick={() => handleMenuItemClick(k)}
							>
								<ListItemIcon>
									{v.icon}
								</ListItemIcon>
								<ListItemText primary={v.title} />
							</ListItem>
						))}
					</List>
				</Paper>
			</Grid>
			<Grid item>
				{menus[selected].content}
			</Grid>
		</Grid>
	)
}

export default EditMessages