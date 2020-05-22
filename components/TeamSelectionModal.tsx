import ClientOnlyPortal from './ClientOnlyPortal'
import Color from "color"

const makeColor = (color): Color => {
	return Color(color.color, color.model)
}

export default function Modal(props) {
	const { teams, onDecide, onCancel } = props
	return (
		<>
			<ClientOnlyPortal selector="#modal">
				<div onClick={onCancel}
					style={{
						position: 'fixed',
						width: '100%',
						height: '100%',
						backgroundColor: 'rgba(0, 0, 0, 0.5)',
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						top: 0,
						left: 0,
					}}>
					<div
						style={{
							position: 'fixed',
							width: '50%',
							height: '50%',
							backgroundColor: 'white',
						}}
					>
						<p>チームを選んでください</p>
						<ul>
							{teams.map((team) => (
								<div
									key={team.id}
									style={{ backgroundColor: makeColor(team.color).hex() }}
									onClick={() => onDecide(team)}
								>{team.name}</div>
							))}
						</ul>
					</div>
				</div>
			</ClientOnlyPortal>
		</>
	)
}
