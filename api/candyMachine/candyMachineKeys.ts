import { CandyMachineEligibleGroupsParams } from 'models/candyMachine/candyMachineEligibleGroupsParams'
import { CandyMachineReceiptParams } from 'models/candyMachine/candyMachineParams'

export const CANDY_MACHINE_QUERY_KEYS = Object.freeze({
	CANDY_MACHINE: 'candy-machine',
	GET: 'get',
	RECEIPTS: 'receipts',
	MINTED_NFTS: 'minted-nfts',
	ELIGIBLE_GROUPS: 'eligible-groups',
	GROUPS: 'groups',
})

export const candyMachineKeys = Object.freeze({
	get: (address: string) => [CANDY_MACHINE_QUERY_KEYS.CANDY_MACHINE, CANDY_MACHINE_QUERY_KEYS.GET, address],
	getReceipts: (params: CandyMachineReceiptParams) => [
		CANDY_MACHINE_QUERY_KEYS.CANDY_MACHINE,
		CANDY_MACHINE_QUERY_KEYS.GET,
		CANDY_MACHINE_QUERY_KEYS.RECEIPTS,
		params.candyMachineAddress,
		params.skip,
		params.take,
	],
	getMintedNfts: (candyMachineAddress: string) => [
		CANDY_MACHINE_QUERY_KEYS.CANDY_MACHINE,
		CANDY_MACHINE_QUERY_KEYS.GET,
		candyMachineAddress,
		CANDY_MACHINE_QUERY_KEYS.MINTED_NFTS,
	],
	getEligibleGroups: (params: CandyMachineEligibleGroupsParams) => [
		CANDY_MACHINE_QUERY_KEYS.CANDY_MACHINE,
		CANDY_MACHINE_QUERY_KEYS.GET,
		CANDY_MACHINE_QUERY_KEYS.ELIGIBLE_GROUPS,
		params.candyMachineAddress,
		params.walletAddress,
	],
	getGroups: (candyMachineAddress: string) => [
		CANDY_MACHINE_QUERY_KEYS.CANDY_MACHINE,
		CANDY_MACHINE_QUERY_KEYS.GET,
		CANDY_MACHINE_QUERY_KEYS.GROUPS,
		candyMachineAddress,
	],
})
