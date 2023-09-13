import React from 'react'

import Button from 'components/Button'
import Label from 'components/Label'
import Input from 'components/Input'
import ArrowRightIcon from 'public/assets/vector-icons/arrow-right.svg'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { RegisterData } from 'models/auth/register'
import { yupResolver } from '@hookform/resolvers/yup'
import { useRegisterCreator } from 'api/auth'
import { RoutePath } from 'enums/routePath'
import { registerValidationSchema } from './schemas'
import clsx from 'clsx'

interface Props {}

const UpdateBasicInfoForm: React.FC<Props> = () => {
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
		<form className='form form--update-basic-info'>
			<Label isRequired>Display name</Label>
			<div className='description'>Your username will be visible to dReader community</div>
			<Input {...register('name')} placeholder='John Doe' />
			<Label isRequired>Email</Label>
			<div className='description'>Your username will be visible to dReader community</div>
			<Input {...register('email')} placeholder='john.doe@dreader.io' />
			<Label isRequired>Password</Label>
			<div className='description'>8 characters minimum. At least 1 lowercase, 1 uppercase character and 1 number</div>
			<Input {...register('password')} type='password' placeholder='********' />
			<Button type='submit' onClick={onSubmitClick} backgroundColor='green-100' className='action-button'>
				Next <ArrowRightIcon className='action-button-icon' />
			</Button>
		</form>
	)
}

export default UpdateBasicInfoForm
