import { TwitterIntentComicMintedParams } from '@/models/twitter/twitterIntentComicMintedParams'

export const TWITTER_QUERY_KEYS = Object.freeze({
	TWITTER: 'twitter',
	INTENT: 'intent',
	COMIC_MINTED: 'comic-minted',
	ISSUE_SPOTLIGHT: 'issue-spotlight'
})

export const twitterKeys = Object.freeze({
	getComicMinted: (params: TwitterIntentComicMintedParams) => [
		TWITTER_QUERY_KEYS.TWITTER,
		TWITTER_QUERY_KEYS.INTENT,
		TWITTER_QUERY_KEYS.COMIC_MINTED,
		params.comicAddress,
		params.utmSource,
	],
	getIssueSpotlight: (id:string | number) => [
		TWITTER_QUERY_KEYS.TWITTER,
		TWITTER_QUERY_KEYS.INTENT,
		TWITTER_QUERY_KEYS.ISSUE_SPOTLIGHT,
		`${id}`
	],
})
