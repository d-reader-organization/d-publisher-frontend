import { CoverRarity } from './coverRarity'

export type IssueCover = {
	rarity: CoverRarity
	artist: string
	isDefault: boolean
	image: string
}
