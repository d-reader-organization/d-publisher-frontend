import { CREATOR_QUERY_KEYS } from 'api/creator/creatorKeys'
import { useToaster } from 'providers/ToastProvider'
import { BasicCreator } from 'models/creator'
import { useMutation } from 'react-query'
import http from 'api/http'

const { CREATOR, UPDATE, FILES } = CREATOR_QUERY_KEYS

const updateCreatorFiles = async (slug: string, request: FormData): Promise<BasicCreator> => {
	const response = await http.patch<BasicCreator>(`${CREATOR}/${UPDATE}/${slug}/${FILES}`, request)
	return response.data
}

export const useUpdateCreatorFiles = (slug: string) => {
	const toaster = useToaster()

	return useMutation({
		mutationFn: (updateData: FormData) => updateCreatorFiles(slug, updateData),
		onSuccess: () => {
			toaster.add('Files updated!', 'success')
		},
		onMutate: toaster.uploadingFiles,
		onError: toaster.onQueryError,
	})
}
