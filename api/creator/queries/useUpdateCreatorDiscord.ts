import http from 'api/http'
import { CREATOR_QUERY_KEYS, creatorKeys } from '../creatorKeys'
import { useToaster } from '@/providers/ToastProvider'
import { useMutation, useQueryClient } from 'react-query'

const { CREATOR, UPDATE_CREATOR_DISCORD } = CREATOR_QUERY_KEYS

const updateCreatorDiscord = async (slug: string, code: string) => {
	try {
		await http.patch<string>(`${CREATOR}/${UPDATE_CREATOR_DISCORD}/${slug}?code=${code}`)
		return { success: true }
	} catch (error) {
		throw error
	}
}

export const useUpdateCreatorDiscord = () => {
	const toaster = useToaster()
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: ({ slug, code }: { slug: string; code: string }) => updateCreatorDiscord(slug, code),
		onSuccess: (data, { slug }) => {
			if (data.success) {
				toaster.add('Discord updated!', 'success')
				queryClient.invalidateQueries(creatorKeys.get(slug))
				queryClient.invalidateQueries(creatorKeys.getMe)
			}
		},
		onError: () => {
			toaster.add('Failed to update Discord. Please try again.', 'error')
		},
	})
}
