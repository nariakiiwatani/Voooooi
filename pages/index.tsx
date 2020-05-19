const Index = () => {
	const handleSubmit = e => {
		e.preventDefault()

	}
	const enterForm = () => (
		<form onSubmit={handleSubmit}>
			<span>部屋ID</span><input type="text" name="roomId" /><br />
			<span>パスワード</span><input type="password" name="password" /><br />
			<span>名前</span><input type="text" name="name" /><br />
			<span>チーム</span><input type="text" name="team" /><br />
			<button onClick={handleSubmit}>入室</button>
		</form>
	)
	return (
		<div>
			<h1>Voext</h1>
			{enterForm()}
		</div>
	);
};

export default Index;
