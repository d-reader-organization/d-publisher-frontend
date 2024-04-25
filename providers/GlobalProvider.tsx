'use client'

import { createContext, useCallback, useContext, useMemo, useState } from 'react'

interface GlobalContextState {
	isLoading: boolean
	setIsLoading: (newValue: boolean) => void
}

const initialContextValue: GlobalContextState = {
	isLoading: false,
	setIsLoading: () => {},
}

export const GlobalContext = createContext<GlobalContextState>(initialContextValue)

export const GlobalContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [isLoading, setIsLoading] = useState(false)

	const setIsLoadingCallback = useCallback((newValue: boolean) => {
		setIsLoading(newValue)
	}, [])

	const value = useMemo(() => ({ isLoading, setIsLoading: setIsLoadingCallback }), [isLoading, setIsLoadingCallback])
	return <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
}


export const useGlobalContext = (): GlobalContextState => useContext(GlobalContext)
