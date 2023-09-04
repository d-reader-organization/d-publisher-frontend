import { COMIC_ISSUE_QUERY_KEYS } from 'api/comicIssue/comicIssueKeys'
import { useToaster } from 'providers/ToastProvider'
import { useMutation } from 'react-query'
import http from 'api/http'

const { COMIC_ISSUE, UPDATE, STATELESS_COVERS } = COMIC_ISSUE_QUERY_KEYS

// Array of CreateStatelessCoverData
const updateComicIssueStatelessCovers = async (id: string | number, request: FormData): Promise<void> => {
	const response = await http.post<void>(`${COMIC_ISSUE}/${UPDATE}/${id}/${STATELESS_COVERS}`, request)
	return response.data
}

export const useUpdateComicIssueStatelessCovers = (id: string | number) => {
	const toaster = useToaster()

	return useMutation({
		mutationFn: (updateData: FormData) => updateComicIssueStatelessCovers(id, updateData),
		onSuccess: () => {
			toaster.add('Covers updated!', 'success')
		},
		onError: toaster.onQueryError,
	})
}
