'use client'

import Header from 'components/layout/Header'
import Button from 'components/Button'
import Input from '@/components/forms/Input'
import LogoIcon from 'public/assets/vector-icons/logo-with-text.svg'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useLoginCreator } from 'api/auth'
import { RoutePath } from 'enums/routePath'
import { LoginData } from 'models/auth/login'
import { loginValidationSchema } from '@/components/forms/schemas'
import useGuestRoute from 'hooks/useCreatorGuestRoute'
import Form from '@/components/forms/Form'
import usePrefetchRoute from '@/hooks/usePrefetchRoute'
import ButtonLink from '@/components/ButtonLink'
import FormActions from '@/components/forms/FormActions'
import Label from '@/components/forms/Label'
import { useToaster } from '@/providers/ToastProvider'
import { useToggle } from '@/hooks'
import Dialog from '@mui/material/Dialog'
import CloseIcon from 'public/assets/vector-icons/close.svg'
import { useState } from 'react'
import { useRequestCreatorPasswordReset } from '@/api/creator/queries/useRequestCreatorPasswordReset'

export default function LoginPage() {
	const [passwordDialogOpen, togglePasswordDialog] = useToggle()
	const [forgotPasswordEmailOrName, setForgotPasswordEmailOrName] = useState('')
	const router = useRouter()
	const toaster = useToaster()
	const nextPage = RoutePath.Dashboard

	const { mutateAsync: login } = useLoginCreator()
	const { mutateAsync: requestPasswordReset } = useRequestCreatorPasswordReset()
	const { register, handleSubmit } = useForm<LoginData>({
		defaultValues: {
			nameOrEmail: '',
			password: '',
		},
		resolver: yupResolver(loginValidationSchema),
	})

	usePrefetchRoute(nextPage)
	useGuestRoute()

	const onSubmitClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault()

		handleSubmit(async (data) => {
			await login(data)
			router.push(nextPage)
		}, toaster.onFormError)()
	}

	const handleForgotPasswordEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setForgotPasswordEmailOrName(event.target.value)
	}

	return (
		<>
			<Header image={<LogoIcon />} />

			<main className='login-page'>
				<h1 className='title'>Welcome back</h1>
				<p className='subtitle'>let&apos;s get back to building!</p>

				<Form centered maxSize='xs' fullWidth className='form--login-creator'>
					<Label isRequired>Email</Label>
					<Input {...register('nameOrEmail')} type='email' placeholder='john.doe@dreader.io' />

					<Label isRequired>Password</Label>
					<Input {...register('password')} type='password' placeholder='********' />

					<FormActions column centered>
						<Button type='submit' onClick={onSubmitClick} backgroundColor='green-500' className='action-button'>
							Let&apos;s go
						</Button>
						<Button
							onClick={togglePasswordDialog}
							type='button'
							backgroundColor='transparent'
							className='action-button action-button--forgot-password'
						>
							Forgot password?
						</Button>

						<ButtonLink
							href={RoutePath.Register}
							clickableEffect={false}
							backgroundColor='transparent'
							className='action-button action-button--register'
						>
							No account? Register here
						</ButtonLink>
					</FormActions>
				</Form>
				<Dialog
					style={{ backdropFilter: 'blur(4px)' }}
					PaperProps={{ className: 'action-dialog forgot-password-dialog' }}
					onClose={togglePasswordDialog}
					maxWidth='xs'
					open={passwordDialogOpen}
				>
					<div className='close-icon-wrapper'>
						<CloseIcon className='close-icon' onClick={togglePasswordDialog} />
					</div>

					<div className='dialog-content'>
						<strong>Reset password</strong>
						<p>
							Type in your email address to send password reset instructions to your mail inbox. Make sure to check your
							spam folder!
						</p>
						<Input
							type='text'
							placeholder='john.doe@dreader.io'
							className='forgot-password-input'
							value={forgotPasswordEmailOrName}
							onChange={handleForgotPasswordEmailChange}
						/>
					</div>

					<div className='dialog-actions'>
						<Button naked onClick={togglePasswordDialog}>
							Cancel
						</Button>
						<Button
							naked
							onClick={async () => {
								await requestPasswordReset({ nameOrEmail: forgotPasswordEmailOrName })
								setForgotPasswordEmailOrName('')
								togglePasswordDialog()
							}}
						>
							Send
						</Button>
					</div>
				</Dialog>
			</main>
		</>
	)
}
