import { PrefetchOptions } from 'next/dist/shared/lib/app-router-context'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

type ToggleHook = (href: string, options?: PrefetchOptions) => void

export const usePrefetchRoute: ToggleHook = (href, options) => {
	const router = useRouter()

	useEffect(() => {
		router.prefetch(href, options)
	}, [])
}

export default usePrefetchRoute
