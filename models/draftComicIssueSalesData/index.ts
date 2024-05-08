export interface DraftComicIssueSalesData {
	id: number
	comicIssueId: number
	revenueRange: string
	supplyRange: string
	launchDateRange: string
	currency: string
	royaltyBasisPoint: number
	royaltyAddress: string
	note: string
	isVerified: boolean
}

export interface CreateDraftComicIssueSalesData {
	comicIssueId: number
	revenueMin: number
	revenueMax: number
	supplyMin: number
	supplyMax: number
	launchDateMin: Date
	launchDateMax: Date
	currencies: string[]
	royaltyBasisPoint: number
	royaltyAddress: string
	note: string
}

export type CreateDraftComicIssueSalesDataPayload = Omit<DraftComicIssueSalesData, 'id' | 'isVerified'>
