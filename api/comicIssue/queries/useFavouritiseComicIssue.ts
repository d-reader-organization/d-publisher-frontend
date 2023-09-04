import { COMIC_ISSUE_QUERY_KEYS } from 'api/comicIssue/comicIssueKeys'
import { useToaster } from 'providers/ToastProvider'
import { useMutation } from 'react-query'
import http from 'api/http'

const { COMIC_ISSUE, FAVOURITISE } = COMIC_ISSUE_QUERY_KEYS

const favouritiseComicIssue = async (id: string | number): Promise<void> => {
	const response = await http.patch<void>(`${COMIC_ISSUE}/${FAVOURITISE}/${id}`)
	return response.data
}

export const useFavouritiseComicIssue = (id: string | number) => {
	const toaster = useToaster()

	return useMutation({
		mutationFn: () => favouritiseComicIssue(id),
		onError: toaster.onQueryError,
	})
}
