const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {
	CleanWebpackPlugin
} = require('clean-webpack-plugin');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');

function resolve(dir) {
	return path.join(__dirname, dir)
}

module.exports = {
	entry: `<%Entry%>`,
	module: {
		rules: [`<%Loader%>`, {
      test: /\.(sa|sc|c)ss$/,
			use: [
				MiniCssExtractPlugin.loader,
				'css-loader',
				'sass-loader'
			]
		}, {
				test: /\.(png|svg|jpg|gif)$/,
				use: [
					'file-loader'
				]
			}, {
				test: /\.(woff|woff2|eot|ttf|otf)$/,
				use: [
					'file-loader'
				]
			}
		]
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.json', '.js'],
		alias: {
			'@': resolve('src'),
			'~': resolve('assets')
		}
	},
	plugins: [
		new CleanWebpackPlugin(),
		new MiniCssExtractPlugin(),
		new HtmlWebpackPlugin({
			title: 'packim',
			template: resolve('index.html')
		})
	],
	output: {
    filename: process.env.NODE_ENV === 'production'
              ? '[name].[chunkhash].js'
              : '[name].[hash].js',
		path: resolve('dist')
	}
};