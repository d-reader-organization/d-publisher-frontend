import { COMIC_ISSUE_QUERY_KEYS } from 'api/comicIssue/comicIssueKeys'
import { useToaster } from 'providers/ToastProvider'
import { useMutation } from 'react-query'
import http from 'api/http'

const { COMIC_ISSUE, PUBLISH_ON_CHAIN } = COMIC_ISSUE_QUERY_KEYS

const publishComicIssueOffChain = async (id: string | number): Promise<void> => {
	const response = await http.patch<void>(`${COMIC_ISSUE}/${PUBLISH_ON_CHAIN}/${id}`)
	return response.data
}

export const usePublishComicIssueOffChain = (id: string | number) => {
	const toaster = useToaster()

	return useMutation({
		mutationFn: () => publishComicIssueOffChain(id),
		onError: toaster.onQueryError,
	})
}
