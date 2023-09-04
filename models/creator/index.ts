import { Genre } from 'models/genre'
import { CreatorStats } from './creatorStats'
import { CreatorMyStats } from './creatorMyStats'

export interface BasicCreator {
	id: number
	email: string
	name: string
	slug: string
	isDeleted: boolean
	isVerified: boolean
	avatar: string
	banner: string
	logo: string
	description: string
	flavorText: string
	tippingAddress: string
	website: string
	twitter: string
	instagram: string
	lynkfire: string
}

export interface Creator extends BasicCreator {
	stats: CreatorStats
	myStats: CreatorMyStats
	genres: Array<Pick<Genre, 'name' | 'slug' | 'color' | 'icon'>>
}

export type UpdateCreatorData = Partial<
	Pick<
		Creator,
		'email' | 'description' | 'flavorText' | 'tippingAddress' | 'website' | 'twitter' | 'instagram' | 'lynkfire'
	>
>

export type UpdateCreatorFilesData = Partial<{
	avatar: File
	banner: File
	logo: File
}>
