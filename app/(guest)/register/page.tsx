'use client'

import Header from 'components/layout/Header'
import Steps from 'components/Steps'
import Button from 'components/Button'
import Label from 'components/Label'
import Input from 'components/Input'
import LogoIcon from 'public/assets/vector-icons/logo-with-text.svg'
import ArrowRightIcon from 'public/assets/vector-icons/arrow-right.svg'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { RegisterData } from 'models/auth/register'
import { yupResolver } from '@hookform/resolvers/yup'
import { useRegisterCreator } from 'api/auth'
import { RoutePath } from 'enums/routePath'
import { registerValidationSchema } from './schemas'
import FormActions from '@/components/FormActions'
import Form from '@/components/Form'

export default function RegisterCreatorPage() {
	const router = useRouter()
	const { mutateAsync: registerCreator } = useRegisterCreator()
	const { register, handleSubmit } = useForm<RegisterData>({
		defaultValues: {
			name: '',
			email: '',
			password: '',
		},
		resolver: yupResolver(registerValidationSchema),
	})

	const onSubmitClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault()

		handleSubmit(async (data) => {
			await registerCreator(data)
			router.push(RoutePath.RegisterYourDetails)
		})()
	}

	return (
		<>
			<Header image={<LogoIcon />} />
			<Steps
				steps={[
					{ label: '01 Create account', isActive: true },
					{ label: '02 Your details', isActive: false },
					{ label: '03 Visual Identity', isActive: false },
					{ label: '04 Connect socials', isActive: false },
					{ label: '05 Submit', isActive: false },
				]}
			/>

			<main className='register-page'>
				<h1 className='title'>Tell us about yourself</h1>

				<Form centered minSize='sm' className='form--register-creator'>
					<Label isRequired>Display name</Label>
					<div className='description'>Your username will be visible to dReader community</div>
					<Input {...register('name')} placeholder='John Doe' />

					<Label isRequired>Email</Label>
					<Input {...register('email')} placeholder='john.doe@dreader.io' />

					<Label isRequired>Password</Label>
					<div className='description'>
						8 characters minimum. At least 1 lowercase, 1 uppercase character and 1 number
					</div>
					<Input {...register('password')} type='password' placeholder='********' />

					<FormActions centered>
						<Button type='submit' onClick={onSubmitClick} backgroundColor='green-100' className='action-button'>
							Next <ArrowRightIcon className='action-button-icon' />
						</Button>
					</FormActions>
				</Form>
			</main>
		</>
	)
}
