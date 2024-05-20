import { useToaster } from 'providers/ToastProvider'
import { useQuery } from 'react-query'
import http from 'api/http'
import { useCreatorAuth } from '@/providers/CreatorAuthProvider'
import { CREATOR_QUERY_KEYS } from '../creatorKeys'

const { CREATOR, DOWNLOAD_ASSETS } = CREATOR_QUERY_KEYS

const downloadCreatorAssets = async (slug: string): Promise<string[]> => {
	const response = await http.get<string[]>(`${CREATOR}/${DOWNLOAD_ASSETS}/${slug}`)
	return response.data
}

export const useDownloadCreatorAssets = (slug: string, enabled: boolean) => {
	const { isAuthenticated } = useCreatorAuth()
	const toaster = useToaster()

	return useQuery({
		queryFn: () => downloadCreatorAssets(slug),
		queryKey: [CREATOR, DOWNLOAD_ASSETS],
		enabled: isAuthenticated && enabled,
		onError: toaster.onQueryError,
	})
}
