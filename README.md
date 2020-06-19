# Voooooi!（ゔぉーい！）

[Voooooi!（ゔぉーい！）](https://voooooi.com/)は`SpeechRecognition API`を使用した、音声認識によるテキストチャットサービスです。

オンライン運動会のためのツールとして開発されています。  
基本的には音声入力によるテキストチャットですが、その他運動会や運動会競技の実施に良い機能は積極的に盛り込んで行きたいと思っています。  

オンライン運動会は[YCAM](https://ycam.jp)と[一般社団法人運動会協会](http://www.undokai.or.jp/)がすすめる、 __「でも、スポーツはつくれる」__ をスローガンとした、オンラインでのあそびの共創と共有に関する活動です。
https://docs.google.com/presentation/d/1ElRXVjCn4oXjRbZTIcJ0eetnF161NbLZV_BU8ZDvm5I/edit?usp=sharing

オンライン運動会も従来の（オフライン型の）運動会も、様々なツールを使用して種目やそのルールが成立しています。  
オフラインであれば運動場や体育館、ボール、綱引きの綱や玉入れのカゴと玉、ハチマキや旗も運動会ツールであると言って良いでしょう。  
オンライン運動会であればPCやスマートフォン、インターネット、ZoomやGoogleDocsなどのオンラインサービスが運動会ツールであると言えるでしょう。  

Voooooi!（ゔぉーい！）はそんなツールの一つとなるべく開発されました。  
これ自体が面白いものというわけではなく、みなさんがこれを使って __自由に遊びの発想を膨らませる__ ことができるツールになればよいなと思っています。  

__ほぼ初めてウェブサービスを作っているのでわからないことだらけです。__  
あらゆる種類のフィードバックや要望を歓迎します。  
GitHub Issuesに書くか、[@nariakiiwatani(Twitter)](https://twitter.com/nariakiiwatani)までご連絡ください。

## Voooooi!を使った競技種目

> 何か作ったり遊んだりしたらぜひご報告ください。  
> こちらに追記していきます。

[ことば玉入れ〜ことタマ〜](https://bit.ly/undokai_kototama)  
お題に合うことばを30秒間で言えた数を競う競技


# Voooooi!（ゔぉーい！）でできること

- 部屋
	- [x] 作成
	- [x] 入室パスワードの設定/変更
	- [x] 招待URL（パスワード埋め込み）の発行
	- [x] 退室
	- [ ] 部屋の削除
	- [ ] 管理者パスワードの変更
- チーム（グループ）
	- [x] 追加
	- [x] 編集
	- [x] 削除
- メッセージ
	- [x] 音声認識による投稿
		- [x] 音声認識の中断/再開
		- [ ] 多言語対応
	- [x] テキスト入力による投稿
	- [x] リアルタイム更新
	- [x] 管理者メッセージの投稿
	- [x] NGワードの設定
		- [x] 正規表現/文字列検索
		- [x] 一致部分のみ置き換え/メッセージ全体を置き換え
	- [ ] メッセージの削除
	- [ ] メッセージのエクスポート
	- 表示
		- [x] 自動スクロール
		- [x] チームごとのタイムライン
		- [x] 全チーム統合タイムライン
		- [x] 自チームのみ表示
		- [ ] スクロールに応じたメッセージの順次読み込み
- 拡張機能
	- [ ] メッセージ読み上げ
	- [ ] 字幕生成

## Voooooi!（ゔぉーい！）の名前について

ネーミングは[Waaaaay!（うぇーい！）](http://waaaaay.com/)から（勝手に）アイデアをいただきました。  
アプリの内容は全く関係ありませんが、__好きなので、敬意を込めて__。  
みなさんWaaaaay!（うぇーい！）もよろしくお願いします。

---

---ここから開発者向け---

# setup

データベースとしてFirebase Cloud Firestoreを使用します。  
リポジトリ直下に`.env.local`ファイルを以下の内容で作成します。  
YOURSの部分はあなたの環境に応じて書き換えてください。  
等号の右側を引用符(`"`や`'`)で __囲わない__ よう気をつけてください。

```
FIREBASE_API_KEY=YOURS
FIREBASE_AUTH_DOMAIN=YOURS
FIREBASE_DATABASE_URL=YOURS
FIREBASE_PROJECT_ID=YOURS
FIREBASE_STORAGE_BUCKET=YOURS
FIREBASE_MESSAGING_SENDER_ID=YOURS
FIREBASE_APP_ID=YOURS
```

# How to deploy

デプロイ先として、FirebaseもしくはVercelを想定しています。

_セットアップをしてから時間が経っているので、うろ覚えで書いています。_  
_試した方は間違いがあれば教えていただけるとありがたいです。_

## Firebaseへデプロイする場合

リポジトリ直下に`.firebaserc`というファイルを以下の内容で作成します。
`YOUR_FIREBASE_PROJECT_ID`は自分のものに置き換えてください。

```
{
  "projects": {
    "default": "YOUR_FIREBASE_PROJECT_ID"
  }
}
```

以下のコマンドでデプロイされます。 

```Shell 
npm run deploy
```

## vercelへデプロイする場合

0. vercelへデプロイするにはGitリポジトリが必要になります。    
このリポジトリをForkもしくはCloneして新たにpushしてください。  

1. [vercel](vercel.com)へアクセスし、Gitリポジトリとリンクしたプロジェクトを作成します。  

2. `Project Settings -> General -> Build & Development Settings` にある `BUILD COMMAND` の欄を `npm run build:now` に設定します。

![vercel build command 設定](https://raw.githubusercontent.com/nariakiiwatani/Voooooi/master/readme_images/vercel_build_settings.png)

3. `Project Settings -> General -> Environment Variables` に、 `setup` の項で `.env.local` に書いた項目をセットします。  
タブが3つ（`Production`/`Preview`/`Development`)あるので全てに設定します。

![vercel environment 設定](https://raw.githubusercontent.com/nariakiiwatani/Voooooi/master/readme_images/vercel_env_values.png)

4. Gitリポジトリにpushするか、以下のコマンドでデプロイされます。  

```Shell
now
```

# いま困っていること（これからやろうとしていること）

- 音声認識非対応ブラウザへの対応
	- いまは多分ページがエラーを吐いて何も動かない
	- 非対応表示したい
	- テキスト入力だけでも参加できるようにしたい
	- 閲覧モードを実装したい

- 拡張機能の枠組みの検討
	- （需要があるかどうかは置いといて）サードパーティのアプリも部屋ごとに登録できるようにしたい
	- 部屋内のメッセージとかデータベースに直接アクセスさせるのが簡単だけどセキュリティ的によくない
	- （今はサーバーレスなので）サーバーを書ける環境に移行するか、NextJSのAPI RoutingとCloudFunctionsでなんとかするか

# ライセンスについて

MIT Licenseです。  
ざっくりいうと「著作権表示をしてもらえればどう使っても構いません。代わりに、私はそれに関して何の責任も負いません」という内容です。  
（あくまで要約です。効力は原文に依存します。）  

意図としては、原作者（私）の権利を守るというよりはむしろ、使用者（あなた）のさらに先の広がりを意識しています。  
スポーツ共創における __「みんなでつくり、あそび、共有する」__ という理念の元、「何かに刺激を受けて作られたあなたの遊びは、__同じように他の誰かの創造性を刺激するかもしれない__」ということを期待しています。  
その意図が条文に反映されるコピーレフトなライセンスも検討しましたが、共創は強制力ではなくモチベーションによってなされるべきだと思い、このようにしました。  
ライセンス条項にソースコードの開示義務はありませんが、ぜひその試行錯誤の過程も含めて共有してください。  
共感していただけたら嬉しいです。  

なお、このような場合にもっと適切なライセンスをご存知の方は教えていただけると助かります。
