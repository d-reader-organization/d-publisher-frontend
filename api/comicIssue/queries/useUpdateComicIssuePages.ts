import { COMIC_ISSUE_QUERY_KEYS } from 'api/comicIssue/comicIssueKeys'
import { useToaster } from 'providers/ToastProvider'
import { useMutation } from 'react-query'
import http from 'api/http'

const { COMIC_ISSUE, UPDATE, PAGES } = COMIC_ISSUE_QUERY_KEYS

// Array of CreateComicPageData
const updateComicIssuePages = async (id: string | number, request: FormData): Promise<void> => {
	const response = await http.post<void>(`${COMIC_ISSUE}/${UPDATE}/${id}/${PAGES}`, request)
	return response.data
}

export const useUpdateComicIssuePages = (id: string | number) => {
	const toaster = useToaster()

	return useMutation({
		mutationFn: (updateData: FormData) => updateComicIssuePages(id, updateData),
		onSuccess: () => {
			toaster.add('Pages updated!', 'success')
		},
		onError: toaster.onQueryError,
	})
}
