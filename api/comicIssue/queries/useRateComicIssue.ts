import { COMIC_ISSUE_QUERY_KEYS } from 'api/comicIssue/comicIssueKeys'
import { useToaster } from 'providers/ToastProvider'
import { RateComicIssue } from 'models/comicIssue/rateComicIssue'
import { useMutation } from 'react-query'
import http from 'api/http'

const { COMIC_ISSUE, RATE } = COMIC_ISSUE_QUERY_KEYS

const rateComicIssue = async (id: string | number, request: RateComicIssue): Promise<void> => {
	const response = await http.patch<void>(`${COMIC_ISSUE}/${RATE}/${id}`, { request })
	return response.data
}

export const useRateComicIssue = (id: string | number) => {
	const toaster = useToaster()

	return useMutation({
		mutationFn: (request: RateComicIssue) => rateComicIssue(id, request),
		onError: toaster.onQueryError,
	})
}
