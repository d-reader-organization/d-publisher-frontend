import React, { useEffect } from 'react'

import Button from 'components/Button'
import Input from '@/components/forms/Input'
import { useForm } from 'react-hook-form'
import { UpdateCreatorData } from 'models/creator'
import { yupResolver } from '@hookform/resolvers/yup'
import { updateCreatorValidationSchema } from './schemas'
import { useFetchMe, useUpdateCreator } from '@/api/creator'
import useAuthenticatedRoute from '@/hooks/useCreatorAuthenticatedRoute'
import TooltipLink from '../TooltipLink'
import Form from './Form'
import Label from './Label'
import Textarea from './Textarea'
import FormActions from './FormActions'

const TippingAddressTooltip = () => {
	return (
		<>
			{`SPL-token compatible wallet address used for receiving donations.

To create a Solana wallet we recommend you start with `}
			<TooltipLink href='https://phantom.app/download'>Phantom</TooltipLink> or{' '}
			<TooltipLink href='https://solflare.com/'>Solflare</TooltipLink>
		</>
	)
}

const UpdateCreatorBasicInfoForm: React.FC = () => {
	const { data: me } = useFetchMe()
	const { mutateAsync: updateCreator } = useUpdateCreator(me?.slug || '')

	const { register, handleSubmit, reset } = useForm<UpdateCreatorData>({
		defaultValues: {
			description: '',
			flavorText: '',
			tippingAddress: '',
		},
		resolver: yupResolver(updateCreatorValidationSchema),
	})

	useAuthenticatedRoute()

	useEffect(() => {
		if (me) {
			reset({
				description: me.description,
				flavorText: me.flavorText,
				tippingAddress: me.tippingAddress,
			})
		}
	}, [me, reset])

	const onSubmitClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault()

		handleSubmit(async (data) => {
			await updateCreator(data)
		})()
	}

	return (
		<Form fullWidth className='form--update-creator-basic-info'>
			<Label isRequired>Email</Label>
			<Input disabled placeholder={me?.email} />

			<Label isRequired>Display name</Label>
			<Input disabled placeholder={me?.name} />

			<Label tooltipText={<TippingAddressTooltip />}>Tipping address</Label>
			<Input {...register('tippingAddress')} placeholder='wallet address' />

			<Label>Short biography</Label>
			<div className='description'>Your bio will be displayed on your dReader creator page</div>
			<Textarea
				maxCharacters={256}
				rows={5}
				{...register('description')}
				defaultValue={me?.description}
				placeholder='Emmy award winning visual development studio. Film, television, gaming, publishing...'
			/>
			<Label>Flavor text</Label>
			<div className='description'>Flavor text will be displayed beneath the description, as a small testimonial</div>
			<Textarea
				maxCharacters={128}
				rows={2}
				{...register('flavorText')}
				defaultValue={me?.flavorText}
				placeholder="Best studio I've ever worked with - my mom"
			/>

			<FormActions>
				<Button type='submit' onClick={onSubmitClick} backgroundColor='green-500' className='action-button'>
					Update
				</Button>
			</FormActions>
		</Form>
	)
}

export default UpdateCreatorBasicInfoForm
