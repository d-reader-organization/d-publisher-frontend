import { COMIC_QUERY_KEYS } from 'api/comic/comicKeys'
import { useToaster } from 'providers/ToastProvider'
import { useMutation } from 'react-query'
import http from 'api/http'

const { COMIC, PUBLISH } = COMIC_QUERY_KEYS

const publishComic = async (slug: string): Promise<void> => {
	const response = await http.patch<void>(`${COMIC}/${PUBLISH}/${slug}`)
	return response.data
}

export const usePublishComic = (slug: string) => {
	const toaster = useToaster()

	return useMutation({
		mutationFn: () => publishComic(slug),
		onError: toaster.onQueryError,
	})
}
