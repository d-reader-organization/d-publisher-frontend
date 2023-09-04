import { CREATOR_QUERY_KEYS } from 'api/creator/creatorKeys'
import { useToaster } from 'providers/ToastProvider'
import { BasicCreator } from 'models/creator'
import { useMutation } from 'react-query'
import http from 'api/http'

const { CREATOR, UPDATE, LOGO } = CREATOR_QUERY_KEYS

const updateCreatorLogo = async (slug: string, request: FormData): Promise<BasicCreator> => {
	const response = await http.patch<BasicCreator>(`${CREATOR}/${UPDATE}/${slug}/${LOGO}`, request)
	return response.data
}

export const useUpdateCreatorLogo = (slug: string) => {
	const toaster = useToaster()

	return useMutation({
		mutationFn: (updateData: FormData) => updateCreatorLogo(slug, updateData),
		onSuccess: () => {
			toaster.add('Logo updated!', 'success')
		},
		onMutate: toaster.uploadingFiles,
		onError: toaster.onQueryError,
	})
}
