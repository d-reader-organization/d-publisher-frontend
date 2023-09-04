'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

import { useUserAuth } from 'providers/UserAuthProvider'
import { RoutePath } from 'enums/routePath'

type AuthenticatedRouteHook = (redirectTo?: string) => void

export const useAuthenticatedRoute: AuthenticatedRouteHook = (redirectTo = RoutePath.Home) => {
	const router = useRouter()
	const { isAuthenticated, isAuthenticating } = useUserAuth()

	useEffect(() => {
		if (!isAuthenticated && !isAuthenticating) {
			router.push(redirectTo)
		}
	}, [isAuthenticated, isAuthenticating, router])

	return
}

export default useAuthenticatedRoute
