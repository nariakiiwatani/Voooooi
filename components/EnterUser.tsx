import { useState, CSSProperties } from "react"
import Color from 'color'
const EnterUser = props => {
	const [formInput, setFormInput] = useState({
		name: "",
	})
	const { name } = formInput
	const { teams } = props
	const [team, setTeam] = useState({})

	const handleSubmit = e => {
		e.preventDefault()
		props.onSubmit({ name, team })
	}

	const handleChange = name => e => {
		setFormInput({
			...formInput,
			[name]: e.target.value
		})
	}
	const handleTeamSelect = t => {
		setTeam(t)
	}
	const createInput = ([label, type, name, value]) => (
		<div>
			<span>{label}</span><input type={type} name={name} value={value} onChange={handleChange(name)} />
		</div>
	)
	return (
		<>
			<div>名前とチームを入力してください</div>
			<form onSubmit={handleSubmit}>
				{createInput(["名前", "text", "name", name])}
				<div className="teams">
					{teams.map((t, i) => {
						const cssColor: CSSProperties = {
							backgroundColor: new Color(t.color.color).toString()
						};
						return <div key={i} data-selected={t.id === team.id} style={cssColor} onClick={() => { handleTeamSelect(t) }}><div></div></div>
					})}
				</div>
				<button type="submit">決定</button>
			</form>
			<style jsx>{`
				.teams {
					display: flex;
					$button-width: 40px;
					$border-width: 3px;
					div {
						position: relative;
						width: $button-width;
						height: $button-width;
						padding: $border-width;
						border-radius: $button-width + $border-width*2;
						&:nth-child(n+2) {
							margin-left: 10px;
						}
						> div {
							position: absolute;
							top: -$border-width;
							left: -$border-width;
							width: $button-width;
							height: $button-width;
						}
						&[data-selected=true] > div {
							border: solid $border-width rgb(170,250,220);
						}
					}
				}
				`}</style>
		</>
	)
}

export default EnterUser