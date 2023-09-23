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
import { loginValidationSchema } from './schemas'
import useGuestRoute from 'hooks/useCreatorGuestRoute'
import Form from '@/components/forms/Form'
import usePrefetchRoute from '@/hooks/usePrefetchRoute'
import ButtonLink from '@/components/ButtonLink'
import FormActions from '@/components/forms/FormActions'
import Label from '@/components/forms/Label'

export default function LoginPage() {
	const router = useRouter()

	const nextPage = RoutePath.Dashboard

	const { mutateAsync: login } = useLoginCreator()
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
		})()
	}

	return (
		<>
			<Header image={<LogoIcon />} />

			<main className='login-page'>
				<h1 className='title'>Welcome back</h1>
				<p className='subtitle'>let&apos;s get back to building!</p>

				<Form padding centered maxSize='xs' fullWidth className='form--login-creator'>
					<Label isRequired>Email</Label>
					<Input {...register('nameOrEmail')} placeholder='john.doe@dreader.io' type='email' />

					<Label isRequired>Password</Label>
					<Input {...register('password')} type='password' placeholder='********' />

					<FormActions column centered>
						<Button type='submit' onClick={onSubmitClick} backgroundColor='green-100' className='action-button'>
							Let&apos;s go
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
			</main>
		</>
	)
}
