/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	redirects: async () => [
		{
			source: '/',
			destination: 'https://www.npmjs.com/package/piskvorky',
			permanent: false,
		},
	],
}

module.exports = nextConfig
