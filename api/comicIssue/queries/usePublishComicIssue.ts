import { COMIC_ISSUE_QUERY_KEYS } from 'api/comicIssue/comicIssueKeys'
import { useToaster } from 'providers/ToastProvider'
import { useMutation } from 'react-query'
import http from 'api/http'

const { COMIC_ISSUE, DELETE } = COMIC_ISSUE_QUERY_KEYS

const deleteComicIssue = async (id: string | number): Promise<void> => {
	const response = await http.patch<void>(`${COMIC_ISSUE}/${DELETE}/${id}`)
	return response.data
}

export const useDeleteComicIssue = (id: string | number) => {
	const toaster = useToaster()

	return useMutation({
		mutationFn: () => deleteComicIssue(id),
		onError: toaster.onQueryError,
	})
}
