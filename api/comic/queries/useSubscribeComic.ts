import { COMIC_QUERY_KEYS } from 'api/comic/comicKeys'
import { useToaster } from 'providers/ToastProvider'
import { useMutation } from 'react-query'
import http from 'api/http'

const { COMIC, SUBSCRIBE } = COMIC_QUERY_KEYS

const subscribeComic = async (slug: string): Promise<void> => {
	const response = await http.patch<void>(`${COMIC}/${SUBSCRIBE}/${slug}`)
	return response.data
}

export const useSubscribeComic = (slug: string) => {
	const toaster = useToaster()

	return useMutation({
		mutationFn: () => subscribeComic(slug),
		onError: toaster.onQueryError,
	})
}
