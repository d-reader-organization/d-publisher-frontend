import { GENRE_QUERY_KEYS } from 'api/genre/genreKeys'
import { useToaster } from 'providers/ToastProvider'
import { useMutation } from 'react-query'
import http from 'api/http'

const { GENRE, DELETE } = GENRE_QUERY_KEYS

const deleteGenre = async (slug: string): Promise<void> => {
	const response = await http.patch<void>(`${GENRE}/${DELETE}/${slug}`)
	return response.data
}

export const useDeleteGenre = (slug: string) => {
	const toaster = useToaster()

	return useMutation({
		mutationFn: () => deleteGenre(slug),
		onSuccess: () => {
			toaster.add('Genre deleted!', 'success')
		},
		onError: toaster.onQueryError,
	})
}
