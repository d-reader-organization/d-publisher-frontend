/** @type {import('next').NextConfig} */
const path = require('path')

const withPWA = require('next-pwa')({
	dest: 'public',
	disable: process.env.NODE_ENV === 'development',
	mode: 'production',
})

module.exports = withPWA({
	reactStrictMode: true,
	sassOptions: {
		includePaths: [path.join(__dirname, 'styles')],
	},
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: '**.amazonaws.com',
			},
			{
				protocol: 'https',
				hostname: '**.cloudfront.net',
			},
			{
				protocol: 'https',
				hostname: 'arweave.net',
			}
		],
	},
	webpack(config) {
		config.module.rules.push({
			test: /\.svg$/,
			use: ['@svgr/webpack'],
		})

		return config
	},
})
