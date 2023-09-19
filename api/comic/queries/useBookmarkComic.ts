import { COMIC_QUERY_KEYS } from 'api/comic/comicKeys'
import { useToaster } from 'providers/ToastProvider'
import { useMutation } from 'react-query'
import http from 'api/http'

const { COMIC, BOOKMARK } = COMIC_QUERY_KEYS

const bookmarkComic = async (slug: string): Promise<void> => {
	const response = await http.patch<void>(`${COMIC}/${BOOKMARK}/${slug}`)
	return response.data
}

export const useBookmarkComic = (slug: string) => {
	const toaster = useToaster()

	return useMutation({
		mutationFn: () => bookmarkComic(slug),
		onError: toaster.onQueryError,
	})
}
