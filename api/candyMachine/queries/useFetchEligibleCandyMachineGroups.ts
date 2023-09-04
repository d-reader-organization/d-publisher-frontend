import { candyMachineKeys, CANDY_MACHINE_QUERY_KEYS } from 'api/candyMachine/candyMachineKeys'
import { useToaster } from 'providers/ToastProvider'
import { CandyMachineGroup } from 'models/candyMachine/candyMachineGroup'
import { CandyMachineEligibleGroupsParams } from 'models/candyMachine/candyMachineEligibleGroupsParams'
import { useQuery } from 'react-query'
import http from 'api/http'

const { CANDY_MACHINE, GET } = CANDY_MACHINE_QUERY_KEYS

const fetchEligibleCandyMachineGroups = async (
	params: CandyMachineEligibleGroupsParams
): Promise<CandyMachineGroup[]> => {
	const response = await http.get<CandyMachineGroup[]>(`${CANDY_MACHINE}/${GET}`, { params })
	return response.data
}

export const useFetchEligibleCandyMachineGroups = (params: CandyMachineEligibleGroupsParams) => {
	const toaster = useToaster()

	return useQuery({
		queryFn: () => fetchEligibleCandyMachineGroups(params),
		queryKey: candyMachineKeys.getEligibleGroups(params),
		staleTime: 1000 * 60 * 3, // stale for 3 minutes
		enabled: !!params.candyMachineAddress,
		onError: toaster.onQueryError,
	})
}
