import { COMIC_QUERY_KEYS } from 'api/comic/comicKeys'
import { useToaster } from 'providers/ToastProvider'
import { RateComic } from 'models/comic/rateComic'
import { useMutation } from 'react-query'
import http from 'api/http'

const { COMIC, RATE } = COMIC_QUERY_KEYS

const rateComic = async (slug: string, request: RateComic): Promise<void> => {
	const response = await http.patch<void>(`${COMIC}/${RATE}/${slug}`, request)
	return response.data
}

export const useRateComic = (slug: string) => {
	const toaster = useToaster()

	return useMutation({
		mutationFn: (request: RateComic) => rateComic(slug, request),
		onError: toaster.onQueryError,
	})
}
