module.exports =
{
	webpack: (config, { defaultLoaders }) => {
		config.module.rules.push({
			test: /\.scss$|\.css$/,
			use: [
				defaultLoaders.babel,
				{
					loader: require("styled-jsx/webpack").loader,
					options: {
						type: "scoped"
					}
				},
				"sass-loader"
			]
		});

		return config;
	},
	target: process.env.DEPLOYMENT_TARGET === "now" ? 'experimental-serverless-trace' : "server",
	distDir: "../../dist/nextjs",
	env: {
		"FIREBASE_API_KEY": process.env.FIREBASE_API_KEY,
		"FIREBASE_AUTH_DOMAIN": process.env.FIREBASE_AUTH_DOMAIN,
		"FIREBASE_DATABASE_URL": process.env.FIREBASE_DATABASE_URL,
		"FIREBASE_PROJECT_ID": process.env.FIREBASE_PROJECT_ID,
		"FIREBASE_STORAGE_BUCKET": process.env.FIREBASE_STORAGE_BUCKET,
		"FIREBASE_MESSAGING_SENDER_ID": process.env.FIREBASE_MESSAGING_SENDER_ID,
		"FIREBASE_APP_ID": process.env.FIREBASE_APP_ID
	}
};