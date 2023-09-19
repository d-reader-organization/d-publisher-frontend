import { SETTINGS_QUERY_KEYS } from 'api/settings/settingsKeys'
import { useToaster } from 'providers/ToastProvider'
import { CreateGlobalStatusData, GlobalStatus } from 'models/settings/globalStatus'
import { useMutation } from 'react-query'
import http from 'api/http'

const { SETTINGS, GLOBAL_STATUS, CREATE } = SETTINGS_QUERY_KEYS

const createGlobalStatus = async (request: CreateGlobalStatusData): Promise<GlobalStatus> => {
	const response = await http.post<GlobalStatus>(`${SETTINGS}/${GLOBAL_STATUS}/${CREATE}`, { request })
	return response.data
}

export const useCreateGlobalStatus = () => {
	const toaster = useToaster()

	return useMutation({
		mutationFn: (request: CreateGlobalStatusData) => createGlobalStatus(request),
		onSuccess: () => {
			toaster.add('Global Status created! 🎉', 'success')
		},
		onError: toaster.onQueryError,
	})
}
