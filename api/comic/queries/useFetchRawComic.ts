import { comicKeys, COMIC_QUERY_KEYS } from 'api/comic/comicKeys'
import { useCreatorAuth } from '@/providers/CreatorAuthProvider'
import { useToaster } from 'providers/ToastProvider'
import { RawComic } from '@/models/comic/rawComic'
import { useQuery } from 'react-query'
import http from 'api/http'
import { isEmpty } from 'lodash'

const { COMIC, GET_RAW } = COMIC_QUERY_KEYS

const fetchRawComic = async (slug: string | undefined): Promise<RawComic> => {
	const response = await http.get<RawComic>(`${COMIC}/${GET_RAW}/${slug}`)
	return response.data
}

export const useFetchRawComic = (slug: string | undefined) => {
	const { isAuthenticated } = useCreatorAuth()
	const toaster = useToaster()

	return useQuery({
		queryFn: () => fetchRawComic(slug),
		queryKey: comicKeys.getRaw(slug),
		staleTime: 1000 * 60 * 30, // stale for 30 minutes
		enabled: isAuthenticated && !isEmpty(slug) && !!slug,
		onError: toaster.onQueryError,
	})
}
