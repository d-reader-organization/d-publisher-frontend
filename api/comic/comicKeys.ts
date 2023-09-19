import { ComicParams } from 'models/comic/comicParams'

export const COMIC_QUERY_KEYS = Object.freeze({
	COMIC: 'comic',
	GET: 'get',
	CREATE: 'create',
	BY_OWNER: 'by-owner',
	UPDATE: 'update',
	COVER: 'cover',
	BANNER: 'banner',
	FILES: 'files',
	PFP: 'pfp',
	LOGO: 'logo',
	RATE: 'rate',
	SUBSCRIBE: 'subscribe',
	BOOKMARK: 'bookmark',
	FAVOURITISE: 'favouritise',
	PUBLISH: 'publish',
	UNPUBLISH: 'unpublish',
	DELETE: 'delete',
	RECOVER: 'recover',
})

export const comicKeys = Object.freeze({
	getMany: (params: ComicParams) => [
		COMIC_QUERY_KEYS.COMIC,
		COMIC_QUERY_KEYS.GET,
		params.titleSubstring,
		params.creatorSlug,
		params.genreSlugs,
		params.filterTag,
		params.sortOrder,
		params.sortTag,
		params.skip,
		params.take,
	],
	get: (slug: string) => [COMIC_QUERY_KEYS.COMIC, COMIC_QUERY_KEYS.GET, slug],
	getByOwner: (userId: number) => [COMIC_QUERY_KEYS.COMIC, COMIC_QUERY_KEYS.GET, COMIC_QUERY_KEYS.BY_OWNER, userId],
})
