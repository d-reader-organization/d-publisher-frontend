import { ComicRarity } from 'enums/comicRarity'

export interface StatelessCover {
	artist: string
	artistTwitterHandle?: string
	rarity: ComicRarity
	share: number
	isDefault: boolean
	image: string
}

export interface CreateStatelessCoverData
	extends Pick<StatelessCover, 'artist' | 'rarity' | 'isDefault' | 'artistTwitterHandle'> {
	share?: StatelessCover['share']
	image?: File
}
