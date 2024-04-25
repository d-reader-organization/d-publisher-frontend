import { COMIC_ISSUE_QUERY_KEYS, comicIssueKeys } from 'api/comicIssue/comicIssueKeys'
import { useToaster } from 'providers/ToastProvider'
import { useMutation, useQueryClient } from 'react-query'
import http from 'api/http'
import { useGlobalContext } from '@/providers/GlobalProvider'

const { COMIC_ISSUE, UPDATE, STATEFUL_COVERS } = COMIC_ISSUE_QUERY_KEYS

// Array of CreateStatefulCoverData
const updateComicIssueStatefulCovers = async (id: string | number, request: FormData): Promise<void> => {
	const response = await http.post<void>(`${COMIC_ISSUE}/${UPDATE}/${id}/${STATEFUL_COVERS}`, request)
	return response.data
}

export const useUpdateComicIssueStatefulCovers = (id: string | number) => {
	const toaster = useToaster()
	const { setIsLoading } = useGlobalContext()
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (updateData: FormData) => updateComicIssueStatefulCovers(id, updateData),
		onSuccess: () => {
			setIsLoading(false)
			toaster.add('Covers updated!', 'success')
			queryClient.invalidateQueries(comicIssueKeys.getRaw(id))
		},
		onMutate: () => {
			setIsLoading(true)
			toaster.uploadingFiles()
		},
		onError: (error: Error) => {
			setIsLoading(false)
			toaster.onQueryError(error)
		},
	})
}
