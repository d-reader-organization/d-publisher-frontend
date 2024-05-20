import { useToaster } from 'providers/ToastProvider'
import { useQuery } from 'react-query'
import http from 'api/http'
import { useCreatorAuth } from '@/providers/CreatorAuthProvider'
import { COMIC_QUERY_KEYS } from '../comicKeys'

const { COMIC, DOWNLOAD_ASSETS } = COMIC_QUERY_KEYS

const downloadComicAssets = async (slug: string): Promise<string[]> => {
	const response = await http.get<string[]>(`${COMIC}/${DOWNLOAD_ASSETS}/${slug}`)
	return response.data
}

export const useDownloadComicAssets = (slug: string, enabled: boolean) => {
	const { isAuthenticated } = useCreatorAuth()
	const toaster = useToaster()

	return useQuery({
		queryFn: () => downloadComicAssets(slug),
		queryKey: [COMIC, DOWNLOAD_ASSETS],
		enabled: isAuthenticated && enabled,
		onError: toaster.onQueryError,
	})
}
