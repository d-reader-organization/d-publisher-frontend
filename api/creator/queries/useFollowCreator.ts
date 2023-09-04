import { CREATOR_QUERY_KEYS } from 'api/creator/creatorKeys'
import { useToaster } from 'providers/ToastProvider'
import { useMutation } from 'react-query'
import http from 'api/http'

const { CREATOR, FOLLOW } = CREATOR_QUERY_KEYS

const followCreator = async (slug: string): Promise<void> => {
	const response = await http.patch<void>(`${CREATOR}/${FOLLOW}/${slug}`)
	return response.data
}

export const useFollowCreator = (slug: string) => {
	const toaster = useToaster()

	return useMutation({
		mutationFn: () => followCreator(slug),
		onSuccess: () => {
			toaster.add('Creator deleted!', 'success')
		},
		onError: toaster.onQueryError,
	})
}
