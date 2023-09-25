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
 * - edit comic
 * - edit comic issue
 * - view comic issues

 * TOMORROW:
 * - stateful covers
 * - publish-on-chain (+isFullyUploaded checkbox) screen
 * - comicIssue.releaseDate is missing when creating a comic issue
 * - comic.collaborators necessary or not?

 * - sign copies
 */

/**
 * deprecate next-sitemap and implement https://nextjs.org/docs/app/api-reference/file-conventions/metadata
 * fetch the comic series to see if the series are, in fact, existing (on comic issue create page)
 * fetch the latest comic issue of a comic and use that data to prefill the comic issue create form
 * number input for statelessCover.share
 * refactor localStorage auth handling to SWR
 * fix the textarea number of characters remaining bug (and when submitting a form flash screen)
 * sidebar should be closeable on mobile screens, shown as a hamburger menu
 * eslint rules for dependency array checks, unused imports etc.
 * IMPORTANT: somewhere within the app explain which assets the creator will need. e.g. when starting to create an issue let the creator know what they'll need to attach
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
