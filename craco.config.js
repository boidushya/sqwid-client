const CracoAlias = require("craco-alias");

// const rewireBabelLoader = require("craco-babel-loader");

module.exports = {
	plugins: [
		{
			plugin: CracoAlias,
			options: {
				source: "jsconfig",
				baseUrl: "./src"
			}
		},
	],
	babel: {
		presets: ['@babel/preset-env', ['@babel/preset-react', { "runtime": "automatic" }]],
		plugins: [
			["@babel/plugin-proposal-class-properties", { "loose": true }],
		]
	},
	webpack: {
		configure: {
			module: {
				rules: [
					{
						test: /\.js$/,
						loader: require.resolve('@open-wc/webpack-import-meta-loader'),
					},
				],
			}
		}
	}
};

// module.exports = {
// 	plugins: [
// 		{
// 			plugin: CracoAlias,
// 			options: {
// 				source: "jsconfig",
// 				baseUrl: "./src"
// 			}
// 		},
// 	]
// };