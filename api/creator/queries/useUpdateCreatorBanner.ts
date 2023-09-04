import { CREATOR_QUERY_KEYS } from 'api/creator/creatorKeys'
import { useToaster } from 'providers/ToastProvider'
import { BasicCreator } from 'models/creator'
import { useMutation } from 'react-query'
import http from 'api/http'

const { CREATOR, UPDATE, BANNER } = CREATOR_QUERY_KEYS

const updateCreatorBanner = async (slug: string, request: FormData): Promise<BasicCreator> => {
	const response = await http.patch<BasicCreator>(`${CREATOR}/${UPDATE}/${slug}/${BANNER}`, request)
	return response.data
}

export const useUpdateCreatorBanner = (slug: string) => {
	const toaster = useToaster()

	return useMutation({
		mutationFn: (updateData: FormData) => updateCreatorBanner(slug, updateData),
		onSuccess: () => {
			toaster.add('Banner updated!', 'success')
		},
		onMutate: toaster.uploadingFiles,
		onError: toaster.onQueryError,
	})
}
