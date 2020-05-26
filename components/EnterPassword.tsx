import { useState, useContext, useEffect } from "react"
import ClientOnlyPortal from './ClientOnlyPortal'
import { UserContext } from './contexts/UserContext'
import Router from 'next/router'

const EnterPassword = props => {

	const user = useContext(UserContext)
	const [formInput, setFormInput] = useState({
		password: "",
	})
	const { password } = formInput

	useEffect(() => {
		if (!user || !user.room) {
			Router.push("/")
		}
	}, [])

	const handleSubmit = e => {
		e.preventDefault()
		props.onSubmit({ password })
	}

	const handleChange = name => e => {
		setFormInput({
			...formInput,
			[name]: e.target.value
		})
	}
	const createInput = ([label, type, name, value]) => (
		<div>
			<span>{label}</span><input type={type} name={name} value={value} onChange={handleChange(name)} />
		</div>
	)
	return (
		<ClientOnlyPortal selector="#modal">
			<p>部屋:${user.room.name}のパスワードを入力してください</p>
			<form onSubmit={handleSubmit}>
				{createInput(["パスワード", "password", "password", password])}
			</form>
		</ClientOnlyPortal>
	)
}

export default EnterPassword