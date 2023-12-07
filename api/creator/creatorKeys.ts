import { RawCreatorParams } from '@/models/creator/rawCreatorParams'
import { CreatorParams } from 'models/creator/creatorParams'

export const CREATOR_QUERY_KEYS = Object.freeze({
	CREATOR: 'creator',
	GET: 'get',
	GET_RAW: 'get-raw',
	ME: 'me',
	UPDATE: 'update',
	UPDATE_PASSWORD: 'update-password',
	RESET_PASSWORD: 'reset-password',
	REQUEST_EMAIL_VERIFICATION: 'request-email-verification',
	VERIFY_EMAIL: 'verify-email',
	FILES: 'files',
	AVATAR: 'avatar',
	BANNER: 'banner',
	LOGO: 'logo',
	DELETE: 'delete',
	RECOVER: 'recover',
	FOLLOW: 'follow',
})

export const creatorKeys = Object.freeze({
	getMany: (params: CreatorParams) => [
		CREATOR_QUERY_KEYS.CREATOR,
		CREATOR_QUERY_KEYS.GET,
		params.nameSubstring,
		params.genreSlugs,
		params.filterTag,
		params.sortOrder,
		params.sortTag,
		params.skip,
		params.take,
	],
	getManyRaw: (params: RawCreatorParams) => [
		CREATOR_QUERY_KEYS.CREATOR,
		CREATOR_QUERY_KEYS.GET,
		params.nameSubstring,
		params.skip,
		params.take,
	],
	get: (slug: string) => [CREATOR_QUERY_KEYS.CREATOR, CREATOR_QUERY_KEYS.GET, slug],
	getRaw: (slug: string) => [CREATOR_QUERY_KEYS.CREATOR, CREATOR_QUERY_KEYS.GET_RAW, slug],
	getMe: [CREATOR_QUERY_KEYS.CREATOR, CREATOR_QUERY_KEYS.GET, CREATOR_QUERY_KEYS.ME],
})
