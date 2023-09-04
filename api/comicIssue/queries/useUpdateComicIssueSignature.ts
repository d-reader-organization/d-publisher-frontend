import { COMIC_ISSUE_QUERY_KEYS } from 'api/comicIssue/comicIssueKeys'
import { useToaster } from 'providers/ToastProvider'
import { BasicComicIssue } from 'models/comicIssue'
import { useMutation } from 'react-query'
import http from 'api/http'

const { COMIC_ISSUE, UPDATE, SIGNATURE } = COMIC_ISSUE_QUERY_KEYS

const updateComicIssueSignature = async (id: string | number, request: FormData): Promise<BasicComicIssue> => {
	const response = await http.patch<BasicComicIssue>(`${COMIC_ISSUE}/${UPDATE}/${id}/${SIGNATURE}`, request)
	return response.data
}

export const useUpdateComicIssueSignature = (id: string | number) => {
	const toaster = useToaster()

	return useMutation({
		mutationFn: (updateData: FormData) => updateComicIssueSignature(id, updateData),
		onSuccess: () => {
			toaster.add('Signature updated!', 'success')
		},
		onError: toaster.onQueryError,
	})
}
