import { USER_QUERY_KEYS } from 'api/user/userKeys'
import { useToaster } from 'providers/ToastProvider'
import { User } from 'models/user'
import { useMutation } from 'react-query'
import http from 'api/http'

const { USER, UPDATE, AVATAR } = USER_QUERY_KEYS

const updateUserAvatar = async (slug: string, request: FormData): Promise<User> => {
	const response = await http.patch<User>(`${USER}/${UPDATE}/${slug}/${AVATAR}`, request)
	return response.data
}

export const useUpdateUserAvatar = (slug: string) => {
	const toaster = useToaster()

	return useMutation({
		mutationFn: (updateData: FormData) => updateUserAvatar(slug, updateData),
		onSuccess: () => {
			toaster.add('Avatar updated!', 'success')
		},
		onMutate: toaster.uploadingFiles,
		onError: toaster.onQueryError,
	})
}
