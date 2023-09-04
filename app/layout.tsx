'use client'

import type { Metadata } from 'next'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { ThemeProvider, CssBaseline } from '@mui/material'
import CreatorAuthProvider from 'providers/CreatorAuthProvider'
import ToastProvider from 'providers/ToastProvider'
import { endpoint, network } from 'constants/environment'
import { getWallets } from 'constants/wallets'
import localFont from 'next/font/local'
import theme from './styles/theme'
import clsx from 'clsx'
import 'app/styles/app.scss'

// TODO: deprecate next-sitemap and implement https://nextjs.org/docs/app/api-reference/file-conventions/metadata

const satoshi = localFont({
	src: [
		{ path: './fonts/Satoshi-Light.woff2', weight: '300', style: 'normal' },
		{ path: './fonts/Satoshi-LightItalic.woff2', weight: '300', style: 'italic' },
		{ path: './fonts/Satoshi-Regular.woff2', weight: '400', style: 'normal' },
		{ path: './fonts/Satoshi-Italic.woff2', weight: '400', style: 'italic' },
		{ path: './fonts/Satoshi-Medium.woff2', weight: '500', style: 'normal' },
		{ path: './fonts/Satoshi-MediumItalic.woff2', weight: '500', style: 'italic' },
		{ path: './fonts/Satoshi-Bold.woff2', weight: '700', style: 'normal' },
		{ path: './fonts/Satoshi-BoldItalic.woff2', weight: '700', style: 'italic' },
		{ path: './fonts/Satoshi-Black.woff2', weight: '900', style: 'normal' },
		{ path: './fonts/Satoshi-BlackItalic.woff2', weight: '900', style: 'italic' },
	],
	display: 'swap',
	preload: true,
})

export const metadata: Metadata = {
	title: 'dPublisher',
	description:
		'Affordable, Authentic & Limited Edition. From manga to comics, now you can own digital graphic novels from your favorite artists and get rewarded for collecting.',
	keywords: 'NFT, dReader, dPublisher, Comic, Solana, SOL, mint, collection, manga, manwha',
	themeColor: '#181A20',
	viewport: 'minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover',
}

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: true,
			refetchOnMount: false,
			refetchOnReconnect: false,
			retry: 1,
			staleTime: 10 * 1000, // stale for 10 seconds
		},
	},
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang='en'>
			<body className={clsx(satoshi.className, 'layout')}>
				<QueryClientProvider client={queryClient}>
					<CreatorAuthProvider>
						<ThemeProvider theme={theme}>
							<ConnectionProvider endpoint={endpoint}>
								<WalletProvider wallets={getWallets(network)} autoConnect>
									<WalletModalProvider className='wallet-dialog'>
										<ToastProvider>
											<CssBaseline />
											{children}
										</ToastProvider>
									</WalletModalProvider>
								</WalletProvider>
							</ConnectionProvider>
						</ThemeProvider>
					</CreatorAuthProvider>
					<ReactQueryDevtools initialIsOpen={false} />
				</QueryClientProvider>
			</body>
		</html>
	)
}
