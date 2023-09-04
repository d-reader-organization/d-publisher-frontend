import { CREATOR_QUERY_KEYS } from 'api/creator/creatorKeys'
import { useToaster } from 'providers/ToastProvider'
import { BasicCreator } from 'models/creator'
import { useMutation } from 'react-query'
import http from 'api/http'

const { CREATOR, UPDATE, AVATAR } = CREATOR_QUERY_KEYS

const updateCreatorAvatar = async (slug: string, request: FormData): Promise<BasicCreator> => {
	const response = await http.patch<BasicCreator>(`${CREATOR}/${UPDATE}/${slug}/${AVATAR}`, request)
	return response.data
}

export const useUpdateCreatorAvatar = (slug: string) => {
	const toaster = useToaster()

	return useMutation({
		mutationFn: (updateData: FormData) => updateCreatorAvatar(slug, updateData),
		onSuccess: () => {
			toaster.add('Avatar updated!', 'success')
		},
		onMutate: toaster.uploadingFiles,
		onError: toaster.onQueryError,
	})
}
