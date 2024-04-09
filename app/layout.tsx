import type { Metadata, Viewport } from 'next'
import CssBaseline from '@mui/material/CssBaseline'
import ClientContext from '@/providers/ClientContextProvider'
import CreatorAuthProvider from 'providers/CreatorAuthProvider'
import ToastProvider from 'providers/ToastProvider'
import localFont from 'next/font/local'
import clsx from 'clsx'
import 'app/styles/app.scss'

/**
 * TODO:
 * - Link TOS somewhere
 * - view & edit comic issue
 * - fix form reset values issues
 * - stateful covers
 * - publish-on-chain (+isFullyUploaded checkbox) screen
 * - comicIssue.releaseDate is missing when creating a comic issue
 * - comic.collaborators necessary or not?
 * - sign copies
 * - number input for statelessCover.share
 * - refactor localStorage auth handling to SWR
 * - deprecate next-sitemap and implement https://nextjs.org/docs/app/api-reference/file-conventions/metadata
 * - use https://github.com/atlassian/react-beautiful-dnd for comic pages upload

 * - upload carousel slides UI, add a creator.role column
 */

// - place images outside of tooltips?
// - better "?" messages (what is signature used for, do we add a cover to the pdf file, do I add logo on top of the cover or not...)
// - show where which asset will be used within the app (Figma files) + link publishing document beforehand
// - TOS
// - record a walkthrough
// - enable renaming comic series and comic issues (update slugs) once per day
// - admin interface (stateful covers, publish screen)

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

export const viewport: Viewport = {
	themeColor: '#15171c',
	viewportFit: 'cover',
	initialScale: 1,
	minimumScale: 1,
	width: 'device-width',
}

export const metadata: Metadata = {
	title: 'dPublisher',
	metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL as string),
	description:
		'📚 An on-chain platform for self-publishing digital comics, tracking user analytics, and capturing the audience',
	keywords: 'NFT, dReader, dPublisher, Comic, Solana, SOL, mint, collection, manga, manwha',
	openGraph: {
		type: 'website',
		title: 'dPublisher',
		description:
			'📚 An on-chain platform for self-publishing digital comics, tracking user analytics, and capturing the audience',
		images: '/assets/images/home-metadata.jpg',
		url: process.env.NEXT_PUBLIC_SITE_URL,
		siteName: 'Home for comics',
	},
	appleWebApp: {
		title: 'dPublisher',
		startupImage: '/assets/apple-touch-icon.png',
	},
	twitter: {
		title: 'dPublisher',
		description:
			'📚 An on-chain platform for self-publishing digital comics, tracking user analytics, and capturing the audience',
		card: 'summary_large_image',
		site: '@dPublisherApp',
		creator: '@dPublisherApp',
		images: '/assets/images/home-metadata.png',
	},
	manifest: '/manifest.json',
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
