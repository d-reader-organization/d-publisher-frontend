import { COMIC_ISSUE_QUERY_KEYS } from 'api/comicIssue/comicIssueKeys'
import { useToaster } from 'providers/ToastProvider'
import { BasicComicIssue } from 'models/comicIssue'
import { useMutation } from 'react-query'
import http from 'api/http'

const { COMIC_ISSUE, UPDATE, FILES } = COMIC_ISSUE_QUERY_KEYS

const updateComicIssueFiles = async (id: string | number, request: FormData): Promise<BasicComicIssue> => {
	const response = await http.patch<BasicComicIssue>(`${COMIC_ISSUE}/${UPDATE}/${id}/${FILES}`, request)
	return response.data
}

export const useUpdateComicIssueFiles = (id: string | number) => {
	const toaster = useToaster()

	return useMutation({
		mutationFn: (updateData: FormData) => updateComicIssueFiles(id, updateData),
		onSuccess: () => {
			toaster.add('Files updated!', 'success')
		},
		onMutate: toaster.uploadingFiles,
		onError: toaster.onQueryError,
	})
}
