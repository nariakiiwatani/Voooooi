import { Link } from '@material-ui/core'

const About = props => {
	return (
		<>
			<h2>Voooooi!（ゔぉーい！）※ベータ版</h2>
			<p>Voooooi!（ゔぉーい！）は音声認識を使用した声テキストチャットです。</p>
			<p>デスクトップ版のChromeのみ対応しています。</p>
			<p>無料で使うことができます。</p>
			<p>オンライン運動会で使用するツールとして開発されています。</p>
			<p>
				機能要望やバグ報告は<Link href="https://github.com/nariakiiwatani/voooooi"><a target="_blank">GitHubリポジトリ</a></Link>
				もしくは<Link href="https://twitter.com/nariakiiwatani"><a target="_blank">作者Twitterアカウント</a></Link>までお願いします。
			</p>
		</>
	)
}

export default About