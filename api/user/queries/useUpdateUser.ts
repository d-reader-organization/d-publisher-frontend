import { USER_QUERY_KEYS } from 'api/user/userKeys'
import { useToaster } from 'providers/ToastProvider'
import { User, UpdateUserData } from 'models/user'
import { useMutation } from 'react-query'
import http from 'api/http'

const { USER, UPDATE } = USER_QUERY_KEYS

const updateUser = async (id: string | number, request: UpdateUserData): Promise<User> => {
	const response = await http.patch<User>(`${USER}/${UPDATE}/${id}`, request)
	return response.data
}

export const useUpdateUser = (id: string | number) => {
	const toaster = useToaster()

	return useMutation({
		mutationFn: (updateData: UpdateUserData) => updateUser(id, updateData),
		onSuccess: () => {
			toaster.add('User account updated!', 'success')
		},
		onError: toaster.onQueryError,
	})
}
