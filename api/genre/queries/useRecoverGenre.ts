import { GENRE_QUERY_KEYS } from 'api/genre/genreKeys'
import { useToaster } from 'providers/ToastProvider'
import { useMutation } from 'react-query'
import http from 'api/http'

const { GENRE, RECOVER } = GENRE_QUERY_KEYS

const recoverGenre = async (slug: string): Promise<void> => {
	const response = await http.patch<void>(`${GENRE}/${RECOVER}/${slug}`)
	return response.data
}

export const useRecoverGenre = (slug: string) => {
	const toaster = useToaster()

	return useMutation({
		mutationFn: () => recoverGenre(slug),
		onSuccess: () => {
			toaster.add('Genre recovered!', 'success')
		},
		onError: toaster.onQueryError,
	})
}
