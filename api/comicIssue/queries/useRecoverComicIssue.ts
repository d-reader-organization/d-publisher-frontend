import { COMIC_ISSUE_QUERY_KEYS } from 'api/comicIssue/comicIssueKeys'
import { useToaster } from 'providers/ToastProvider'
import { useMutation } from 'react-query'
import http from 'api/http'

const { COMIC_ISSUE, RECOVER } = COMIC_ISSUE_QUERY_KEYS

const recoverComicIssue = async (id: string | number): Promise<void> => {
	const response = await http.patch<void>(`${COMIC_ISSUE}/${RECOVER}/${id}`)
	return response.data
}

export const useRecoverComicIssue = (id: string | number) => {
	const toaster = useToaster()

	return useMutation({
		mutationFn: () => recoverComicIssue(id),
		onSuccess: () => {
			toaster.add('Comic issue recovered!', 'success')
		},
		onError: toaster.onQueryError,
	})
}
