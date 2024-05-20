'use client'

import FormActions from '@/components/forms/FormActions'
import Button from '@/components/Button'
import { useForm } from 'react-hook-form'
import { ResetPasswordData } from '@/models/auth/resetPassword'
import { yupResolver } from '@hookform/resolvers/yup'
import Form from '@/components/forms/Form'
import Label from '@/components/forms/Label'
import Input from '@/components/forms/Input'
import { useToaster } from '@/providers/ToastProvider'
import { resetPasswordValidationSchema } from '@/components/forms/schemas'
import { useResetCreatorPassword } from '@/api/creator'

interface Params {
	verificationToken: string
}

export default function ResetPasswordPage({ params }: { params: Params }) {
	const verificationToken = params?.verificationToken
	const toaster = useToaster()

	const { mutateAsync: resetPassword } = useResetCreatorPassword()
	const { register, handleSubmit } = useForm<ResetPasswordData>({
		defaultValues: {
			verificationToken,
			newPassword: '',
		},
		resolver: yupResolver(resetPasswordValidationSchema),
	})

	const onSubmitClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault()

		handleSubmit(async (data) => {
			await resetPassword(data)
		}, toaster.onFormError)()
	}

	return (
		<main className='reset-password-page'>
			<h1 className='title'>Reset password</h1>

			<Form centered maxSize='xs' fullWidth className='form--login-user'>
				<Label isRequired>New password</Label>
				<p className='description'>8 characters minimum. At least 1 lowercase, 1 uppercase and 1 number</p>
				<Input {...register('newPassword')} type='password' placeholder='********' />

				<FormActions column centered>
					<Button backgroundColor='green-500' className='action-button' type='submit' onClick={onSubmitClick}>
						Update
					</Button>
				</FormActions>
			</Form>
		</main>
	)
}
