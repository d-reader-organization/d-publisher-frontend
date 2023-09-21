import type { Metadata } from 'next'
import { CssBaseline } from '@mui/material'
import ClientContext from '@/providers/ClientContextProvider'
import CreatorAuthProvider from 'providers/CreatorAuthProvider'
import ToastProvider from 'providers/ToastProvider'
import localFont from 'next/font/local'
import clsx from 'clsx'
import 'app/styles/app.scss'

/**
 * TODO:
 * deprecate next-sitemap and implement https://nextjs.org/docs/app/api-reference/file-conventions/metadata
 * fetch the comic series to see if the series are, in fact, existing (on comic issue create page)
 * fetch the latest comic issue of a comic and use that data to prefill the comic issue create form
 * upload stateful covers screen

 * number input for statelessCover.share
 * numberOfPreviewPages should work differently

 * IMPORTANT: publish-on-chain (+isFullyUploaded checkbox) screen

 * IMPORTANT: revise all image ratios, input descriptions, input tooltip texts
 * IMPORTANT: comicIssue.releaseDate is missing
 * IMPORTANT: verify-email webpage
 * IMPORTANT: edit comic
 * IMPORTANT: edit comic issue
 * IMPORTANT: view comics
 * IMPORTANT: view comic issues
 * IMPORTANT: sign copies
 * IMPORTANT: 404 page
 */

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
	metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL as string),
	description:
		'📚 An on-chain platform for self-publishing digital comics, tracking user analytics, and capturing the audience',
	keywords: 'NFT, dReader, dPublisher, Comic, Solana, SOL, mint, collection, manga, manwha',
	themeColor: '#181A20',
	viewport: 'minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover',
	openGraph: {
		type: 'website',
		title: 'dPublisher',
		description:
			'📚 An on-chain platform for self-publishing digital comics, tracking user analytics, and capturing the audience',
		images: '/assets/images/home-metadata.jpg',
		url: process.env.NEXT_PUBLIC_SITE_URL,
		siteName: 'Home for comics',
	},
	twitter: {
		title: 'dPublisher',
		description:
			'📚 An on-chain platform for self-publishing digital comics, tracking user analytics, and capturing the audience',
		site: undefined,
		card: 'summary_large_image',
	},
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang='en'>
			<body className={clsx(satoshi.className, 'layout')}>
				<ClientContext>
					<CreatorAuthProvider>
						<ToastProvider>
							<CssBaseline />
							{children}
						</ToastProvider>
					</CreatorAuthProvider>
				</ClientContext>
			</body>
		</html>
	)
}
