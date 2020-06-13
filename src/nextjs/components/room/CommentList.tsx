import { useEffect, useRef, useLayoutEffect, useMemo, RefObject } from 'react';
import { List, ListItem, Paper, ListSubheader } from '@material-ui/core';
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
	const { room, teams, users, messages } = props
	const commentsRef = useRef()
	const scrollRef = useRef(null);
	const { bottom: restScroll, scrollTo } = useScrollCustom(scrollRef);
	const adminTeam = useCollection(`rooms/${room.id}/teams/admin`)
	const ngWords = useCollection(`rooms/${room.id}/ngMessages`, {
		listen: true,
		orderBy: ['createdAt', 'asc']
	})

	const userMap = useMemo(() => {
		return users.reduce((acc, user) => ({ ...acc, [user.id]: user }), {})
	}, [users])
	const teamMap = useMemo(() => {
		return [...teams, adminTeam.data].reduce((acc, team) => ({ ...acc, [team?.id]: team }), {})
	}, [teams, adminTeam.data])

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
	}, [messages]);

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
				dense
			>
				<div ref={commentsRef}>
					{messages && messages.filter(m => teams.some(t => t?.id === m.team)).map((m, i) => (
						<ListItem key={i} >
							<UserComment message={m} ng={ngWords.data} user={userMap[m.user]} team={teamMap[m.team]} />
						</ListItem>
					))}
				</div>
			</List>
		</Paper >
	)
}

export default CommentList