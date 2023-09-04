import { GENRE_QUERY_KEYS } from 'api/genre/genreKeys'
import { useToaster } from 'providers/ToastProvider'
import { Genre, UpdateGenreData } from 'models/genre'
import { useMutation } from 'react-query'
import http from 'api/http'

const { GENRE, UPDATE } = GENRE_QUERY_KEYS

const updateGenre = async (slug: string, request: UpdateGenreData): Promise<Genre> => {
	const response = await http.patch<Genre>(`${GENRE}/${UPDATE}/${slug}`, { request })
	return response.data
}

export const useUpdateGenre = (slug: string) => {
	const toaster = useToaster()

	return useMutation({
		mutationFn: (request: UpdateGenreData) => updateGenre(slug, request),
		onSuccess: () => {
			toaster.add('Genre updated! 🎉', 'success')
		},
		onError: toaster.onQueryError,
	})
}
