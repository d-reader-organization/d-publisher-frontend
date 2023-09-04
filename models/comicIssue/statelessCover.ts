import { ComicRarity } from 'enums/comicRarity'

export interface StatelessCover {
	artist: string
	rarity: ComicRarity
	share: number
	isDefault: boolean
	image: string
}

export interface CreateStatelessCoverData extends Pick<StatelessCover, 'artist' | 'rarity' | 'isDefault' | 'image'> {
	share?: StatelessCover['share']
}
