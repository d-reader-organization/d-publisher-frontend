import { PartialGenre } from '@/models/genre'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import { QueryObserverResult } from 'react-query'

export function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * @param string string to shorten
 * @param slice size of a slice
 * @returns short version of the string in a format '[slice]...[slice]'
 */
export const shortenString = (string: string, slice = 4): string => {
	if (string.length < slice * 2 + 3) return string
	return `${string.slice(0, slice)}..${string.slice(-slice)}`
}

export const getUnixTimeInSeconds = () => {
	return new Date().getTime() / 1000
}

export function getRandomInt(min: number, max: number) {
	return min + Math.floor(Math.random() * max)
}

export function getRandomFloat(min: number, max: number) {
	return (min + Math.random() * max).toFixed(1)
}

export function formatPrice(price: number) {
	return price ? price / LAMPORTS_PER_SOL : price
}

export function prependHttps(string?: string) {
	if (string) {
		return 'https://' + string
	} else return ''
}

export function prependTwitter(string?: string) {
	if (string) {
		return prependHttps('twitter.com/') + string
	} else return ''
}

export function prependInstagram(string?: string) {
	if (string) {
		return prependHttps('instagram.com/') + string
	} else return ''
}

export function prependTikTok(string?: string) {
	if (string) {
		return prependHttps('tiktok.com/@') + string
	} else return ''
}

export function prependYouTube(string?: string) {
	if (string) {
		return prependHttps('youtube.com/@') + string
	} else return ''
}

export function prependLynkfire(string?: string) {
	if (string) {
		return prependHttps('lynkfire.com/') + string
	} else return ''
}

export function removeHttps(string?: string) {
	if (string?.startsWith('https://')) {
		return string.substring(8)
	} else return string
}

export function removeTwitter(string?: string) {
	if (string?.startsWith('https://twitter.com/')) {
		return string.substring(20)
	} else if (string?.startsWith('https://www.twitter.com/')) {
		return string.substring(24)
	} else if (string?.startsWith('https://x.com/')) {
		return string.substring(18)
	} else if (string?.startsWith('https://www.x.com/')) {
		return string.substring(22)
	} else return ''
}

export function removeInstagram(string?: string) {
	if (string?.startsWith('https://instagram.com/')) {
		return string.substring(22)
	} else if (string?.startsWith('https://www.instagram.com/')) {
		return string.substring(26)
	} else return ''
}

export function removeTikTok(string?: string) {
	if (string?.startsWith('https://tiktok.com/@')) {
		return string.substring(20)
	} else if (string?.startsWith('https://www.tiktok.com/@')) {
		return string.substring(24)
	} else return ''
}

export function removeYouTube(string?: string) {
	if (string?.startsWith('https://youtube.com/@')) {
		return string.substring(21)
	} else if (string?.startsWith('https://www.youtube.com/@')) {
		return string.substring(25)
	} else return ''
}

export function removeLynkfire(string?: string) {
	if (string?.startsWith('https://lynkfire.com/')) {
		return string.substring(21)
	} else if (string?.startsWith('https://www.lynkfire.com/')) {
		return string.substring(25)
	} else return ''
}

export function isBrave() {
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	if (window.navigator.brave != undefined) {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		return window.navigator.brave.isBrave.name == 'isBrave'
	} else {
		return false
	}
}

export function genresToSlugs(genres: PartialGenre[]): string[] {
	return genres.map((genre) => genre.slug)
}

export async function handleAssetDownloads<T>(refetchDownloadLinks : ()=>Promise<QueryObserverResult<string[], Error>>){
		const {data:links} = await refetchDownloadLinks();
		if(links){
			for (const link of links) {
				const obj = window.open(link, '_self', 'popup')
				// wait for download to start before closing the context window
				await sleep(2000)
				obj?.close()
			}
		}
}
export function isASocialHandle(value: string) {
	return !value.includes('/') && !value.includes('@')
}
