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
							{Object.keys(teams).map(key => (
								<div
									key={key}
									style={{ backgroundColor: makeColor(teams[key].color).hex() }}
									onClick={() => onDecide(teams[key])}
								>{key}</div>
							))}
						</ul>
					</div>
				</div>
			</ClientOnlyPortal>
		</>
	)
}
