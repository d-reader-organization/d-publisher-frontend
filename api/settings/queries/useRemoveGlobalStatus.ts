import { SETTINGS_QUERY_KEYS } from 'api/settings/settingsKeys'
import { useToaster } from 'providers/ToastProvider'
import { GlobalStatus } from 'models/settings/globalStatus'
import { useMutation } from 'react-query'
import http from 'api/http'

const { SETTINGS, GLOBAL_STATUS, UPDATE } = SETTINGS_QUERY_KEYS

const removeGlobalStatus = async (id: number): Promise<GlobalStatus> => {
	const response = await http.patch<GlobalStatus>(`${SETTINGS}/${GLOBAL_STATUS}/${id}/${UPDATE}`)
	return response.data
}

export const useRemoveGlobalStatus = () => {
	const toaster = useToaster()

	return useMutation({
		mutationFn: (id: number) => removeGlobalStatus(id),
		onSuccess: () => {
			toaster.add('Global Status removed!', 'success')
		},
		onError: toaster.onQueryError,
	})
}
