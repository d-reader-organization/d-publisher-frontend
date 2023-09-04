import { Wallet } from 'models/wallet'
import { User } from 'models/user'
import { ComicRarity } from 'enums/comicRarity'
import { NftAttribute } from 'models/nft/nftAttribute'

export interface ListedNftItem {
	id: number
	nftAddress: string
	name: string
	cover: string
	seller: Pick<User, 'id' | 'avatar' | 'name'> & Pick<Wallet, 'address'>
	tokenAddress: string
	price: number
	attributes: NftAttribute[]
	isUsed: boolean
	isSigned: boolean
	rarity: ComicRarity
}
