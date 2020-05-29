import Document, { Head, Main, NextScript } from 'next/document'

export default class MyDocument extends Document {
	render() {
		return (
			<html>
				<Head />
				<body>
					<Main />
					<div id="modal" />
					<NextScript />
					<style jsx global>{`
						/* Other global styles such as 'html, body' etc... */

						html, body {
							height: 100%;
							margin: 0;
						}

						#__next {
							display: flex;
							flex-direction: column;
							height: 100%;
						}
					`}</style>
				</body>
			</html>
		)
	}
}