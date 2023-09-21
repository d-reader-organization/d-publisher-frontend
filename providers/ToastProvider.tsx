'use client'

import { useState, useMemo, useCallback, createContext, useContext } from 'react'
import { Snackbar, Alert, AlertColor, CircularProgress } from '@mui/material'
import axios, { AxiosError } from 'axios'

interface Toast {
	message: React.ReactNode
	severity?: AlertColor
	isOpen: boolean
	duration: number | null
}

interface ToastContextState {
	add: (message: React.ReactNode, severity: AlertColor) => void
	uploadingFiles: () => void
	onQueryError: (error: Error) => void
}

const initialContextValue: ToastContextState = {
	add: () => {},
	uploadingFiles: () => {},
	onQueryError: () => {},
}

export const ToastContext = createContext<ToastContextState>(initialContextValue)

const defaultAutoHideDuration = 4000

export const initialToastState: Toast = {
	message: '',
	severity: undefined,
	isOpen: false,
	duration: defaultAutoHideDuration,
}

const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [toast, setToast] = useState(initialToastState)

	const add = useCallback((message: React.ReactNode, severity: AlertColor, duration = defaultAutoHideDuration) => {
		setToast({ message: message || '', severity, isOpen: true, duration })
	}, [])

	const uploadingFiles = useCallback(() => {
		setToast({ message: 'Uploading file(s)', severity: 'info', isOpen: true, duration: null })
	}, [])

	const remove = () => {
		setToast((prevToast) => ({ ...prevToast, isOpen: false, duration: defaultAutoHideDuration }))
	}

	const onQueryError = useCallback(
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(error: any | AxiosError<any>) => {
			let message = ''
			if (axios.isAxiosError(error)) {
				message = error.response?.data.message
			} else {
				if (Array.isArray(error?.message)) {
					message = error.message.join(', ')
				} else message = error?.message
			}

			add(message, 'error')
		},
		[add]
	)

	const value = useMemo(() => ({ add, uploadingFiles, onQueryError }), [add, uploadingFiles, onQueryError])

	return (
		<ToastContext.Provider value={value}>
			{children}
			<Snackbar
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'right',
				}}
				autoHideDuration={toast.duration}
				open={toast.isOpen}
				onClose={toast.duration === null ? undefined : remove}
				style={{ zIndex: 2001 }}
			>
				<Alert
					classes={{ root: 'snackbar-alert', message: 'snackbar-message' }}
					elevation={6}
					variant='filled'
					severity={toast.severity}
					style={{ alignItems: 'center' }}
					icon={toast.duration === null ? <CircularProgress size={18} /> : undefined}
				>
					{toast.message}
				</Alert>
			</Snackbar>
		</ToastContext.Provider>
	)
}

export default ToastProvider

export const useToaster = (): ToastContextState => useContext(ToastContext)
