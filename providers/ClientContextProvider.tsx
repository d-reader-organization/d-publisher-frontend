'use client'

import { ThemeProvider } from '@mui/material/styles'
import { createContext, useContext } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import theme from 'app/styles/theme'

export const ClientContext = createContext(null)

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: true,
			refetchOnMount: false,
			refetchOnReconnect: false,
			retry: 1,
			staleTime: 10 * 1000, // stale for 10 seconds
		},
	},
})

const ClientContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider theme={theme}>{children}</ThemeProvider>
		</QueryClientProvider>
	)
}

export default ClientContextProvider

export const useClientContext = (): null => useContext(ClientContext)
