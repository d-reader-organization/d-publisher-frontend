import { COMIC_ISSUE_QUERY_KEYS } from 'api/comicIssue/comicIssueKeys'
import { useToaster } from 'providers/ToastProvider'
import { useMutation } from 'react-query'
import http from 'api/http'

const { COMIC_ISSUE, READ } = COMIC_ISSUE_QUERY_KEYS

const readComicIssue = async (id: string | number): Promise<void> => {
	const response = await http.patch<void>(`${COMIC_ISSUE}/${READ}/${id}`)
	return response.data
}

export const useReadComicIssue = (id: string | number) => {
	const toaster = useToaster()

	return useMutation({
		mutationFn: () => readComicIssue(id),
		onError: toaster.onQueryError,
	})
}
