import { useEffect, useRef, useLayoutEffect, useMemo, RefObject } from 'react';
import { List, ListItem, ListItemText, Paper, ListSubheader, Typography } from '@material-ui/core';
import { useCollection } from '@nandorojo/swr-firestore';
import { useScroll } from "react-use"
import React from "react"
import UserComment from './Comment';


const useScrollCustom = (ref: RefObject<HTMLElement>) => {
	const original = useScroll(ref)

	return {
		...original,
		left: original.x,
		top: original.y,
		right: ref.current && (ref.current.scrollWidth - original.x - ref.current.clientWidth),
		bottom: ref.current && (ref.current.scrollHeight - original.y - ref.current.clientHeight),
		scrollTo: ({ top, left, right, bottom }: { top?: number, left?: number, right?: number, bottom?: number }) => {
			if (right !== undefined) left = ref.current.scrollWidth - right
			if (bottom !== undefined) top = ref.current.scrollHeight - bottom
			ref.current.scrollTo({ left, top })
		}
	}
}

const CommentList = (props) => {
	const { room, team } = props
	const commentsRef = useRef()
	const scrollRef = useRef(null);
	const { bottom: restScroll, scrollTo } = useScrollCustom(scrollRef);
	const users = useCollection(`rooms/${room.id}/users`)
	const teams = useCollection(`rooms/${room.id}/teams`)
	const messages = useCollection<{ user: string, team: string, createdAt: any }>(`rooms/${room.id}/messages`,
		{
			listen: true,
			where: team ? ["team", "==", team.id] : undefined,
			orderBy: ["createdAt", "asc"]
		}
	)
	const userMap = useMemo(() => {
		return !users.data ?
			{} :
			users.data.reduce((acc, user) => ({ ...acc, [user.id]: user }), {})
	}, [users.data])
	const teamMap = useMemo(() => {
		return !teams.data ?
			{} :
			teams.data.reduce((acc, team) => ({ ...acc, [team.id]: team }), {})
	}, [teams.data])

	useEffect(() => {
		const comments: HTMLElement = commentsRef.current;
		const calcCommentsHeight = count => {
			let ret = 0;
			for (let child = comments.lastElementChild as HTMLElement; count-- > 0 && child; child = child.previousElementSibling as HTMLElement) {
				ret += child.clientHeight
			}
			return ret
		}
		const margin = 10
		if (restScroll < calcCommentsHeight(2) + margin) {
			scrollTo({ bottom: 0 })
		}
	}, [messages.data]);

	useLayoutEffect(() => {
		scrollTo({ bottom: 0 })
	}, [])

	return (
		<Paper ref={scrollRef}
			style={{
				height: "100%",
				overflow: "auto",
				overflowWrap: "break-word"
			}}>
			<List
				subheader={team ? <ListSubheader>{team.name}</ListSubheader> : <></>}
				dense
			>
				<div ref={commentsRef}>
					{messages.data && messages.data.map((m, i) => (
						<ListItem key={i} >
							<UserComment message={m} user={userMap[m.user]} team={teamMap[m.team]} />
						</ListItem>
					))}
				</div>
			</List>
		</Paper >
	)
}

export default CommentList