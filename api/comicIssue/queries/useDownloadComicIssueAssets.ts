import { COMIC_ISSUE_QUERY_KEYS } from 'api/comicIssue/comicIssueKeys'
import { useToaster } from 'providers/ToastProvider'
import { useQuery } from 'react-query'
import http from 'api/http'
import { useCreatorAuth } from '@/providers/CreatorAuthProvider'

const { COMIC_ISSUE, DOWNLOAD_ASSETS } = COMIC_ISSUE_QUERY_KEYS

const downloadComicIssueAssets = async (id: string | number): Promise<string[]> => {
	const response = await http.get<string[]>(`${COMIC_ISSUE}/${DOWNLOAD_ASSETS}/${id}`)
	return response.data
}

export const useDownloadComicIssueAssets = (comicIssueId: string | number, enabled: boolean) => {
	const { isAuthenticated } = useCreatorAuth()
	const toaster = useToaster()

	return useQuery({
		queryFn: () => downloadComicIssueAssets(comicIssueId),
		queryKey: [COMIC_ISSUE, DOWNLOAD_ASSETS],
		enabled: isAuthenticated && enabled,
		onError: toaster.onQueryError,
	})
}
