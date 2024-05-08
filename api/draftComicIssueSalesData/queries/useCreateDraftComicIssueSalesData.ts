import { useToaster } from 'providers/ToastProvider'
import { useMutation, useQueryClient } from 'react-query'
import http from 'api/http'
import { DRAFT_COMIC_ISSUE_SALES_DATA_QUERY_KEYS } from '../draftComicIssueSalesDataKeys'
import {
	CreateDraftComicIssueSalesData,
	CreateDraftComicIssueSalesDataPayload,
	DraftComicIssueSalesData,
} from '@/models/draftComicIssueSalesData'

const { DRAFT_COMIC_ISSUE_SALES_DATA, CREATE } = DRAFT_COMIC_ISSUE_SALES_DATA_QUERY_KEYS

const createDraftComicIssueSalesData = async (
	request: CreateDraftComicIssueSalesDataPayload
): Promise<DraftComicIssueSalesData> => {
	const response = await http.post<DraftComicIssueSalesData>(`${DRAFT_COMIC_ISSUE_SALES_DATA}/${CREATE}`, request)
	return response.data
}

export const useCreateDraftComicIssueSalesData = () => {
	const toaster = useToaster()
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (request: CreateDraftComicIssueSalesData) =>
			createDraftComicIssueSalesData(mapDraftDataForApiCall(request)),
		onSuccess: () => {
			toaster.add('Request for comic sale has been submitted! 🎉', 'success')
			queryClient.invalidateQueries([DRAFT_COMIC_ISSUE_SALES_DATA])
			queryClient.invalidateQueries([CREATE])
		},
		onError: toaster.onQueryError,
	})
}

export const mapDraftDataForApiCall = (
	request: CreateDraftComicIssueSalesData
): CreateDraftComicIssueSalesDataPayload => {
	return {
		comicIssueId: request.comicIssueId,
		currency: request.currencies.join(','),
		launchDateRange: `${request.launchDateMin.toLocaleDateString()}__${request.launchDateMax.toLocaleDateString()}`,
		note: request.note,
		revenueRange: `${request.revenueMin}-${request.revenueMax}`,
		royaltyAddress: request.royaltyAddress,
		royaltyBasisPoint: request.royaltyBasisPoint,
		supplyRange: `${request.supplyMin}-${request.supplyMax}`,
	}
}
