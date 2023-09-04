import { COMIC_QUERY_KEYS } from 'api/comic/comicKeys'
import { useToaster } from 'providers/ToastProvider'
import { useMutation } from 'react-query'
import http from 'api/http'

const { COMIC, UNPUBLISH } = COMIC_QUERY_KEYS

const unpublishComic = async (slug: string): Promise<void> => {
	const response = await http.patch<void>(`${COMIC}/${UNPUBLISH}/${slug}`)
	return response.data
}

export const useUnpublishComic = (slug: string) => {
	const toaster = useToaster()

	return useMutation({
		mutationFn: () => unpublishComic(slug),
		onError: toaster.onQueryError,
	})
}
