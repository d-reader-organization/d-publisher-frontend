import { Nft } from 'models/nft'
import { User } from 'models/user'
import { Wallet } from 'models/wallet'

export interface CandyMachineReceipt {
	nft: Pick<Nft, 'address' | 'name'>
	buyer: Pick<User, 'id' | 'avatar' | 'name'> & Pick<Wallet, 'address'>
	candyMachineAddress: string
	price: number
	timestamp: string
}
