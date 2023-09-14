import React, { useEffect } from 'react'

import Button from 'components/Button'
import Label from 'components/Label'
import Input from 'components/Input'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { UpdateCreatorData } from 'models/creator'
import { yupResolver } from '@hookform/resolvers/yup'
import { RoutePath } from 'enums/routePath'
import { updateCreatorValidationSchema } from './schemas'
import { useFetchMe, useUpdateCreator } from '@/api/creator'
import useAuthenticatedRoute from '@/hooks/useCreatorAuthenticatedRoute'
import FormActions from '../FormActions'
import Textarea from '../Textarea'
import Form from '../Form'

const UpdateBasicInfoForm: React.FC = () => {
	const router = useRouter()

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
			router.push(RoutePath.RegisterYourDetails)
		})()
	}

	return (
		<Form fullWidth className='form--update-basic-info'>
			<Label isRequired>Email</Label>
			<Input disabled value={me?.email} placeholder='john.doe@dreader.io' />

			<Label isRequired>Display name</Label>
			<Input disabled value={me?.name} placeholder='John Doe' />

			<Label isRequired>Tipping address</Label>
			<div className='description'>SPL-token compatible wallet address used for receiving tips</div>
			<Input placeholder='7At..bCy' />

			<Label>Short biography</Label>
			<div className='description'>Your bio will be displayed on your dReader creator page</div>
			<Textarea
				maxCharacters={256}
				rows={5}
				{...register('description')}
				placeholder='Emmy award winning visual development studio. Film, television, gaming, publishing...'
			/>
			<Label>Flavor text</Label>
			<div className='description'>Flavor text will be displayed beneath the description, as a small testimonial</div>
			<Textarea
				maxCharacters={128}
				rows={2}
				{...register('flavorText')}
				placeholder="Best studio I've ever worked with - my mom"
			/>

			<FormActions>
				<Button type='submit' onClick={onSubmitClick} backgroundColor='green-100' className='action-button'>
					Update
				</Button>
			</FormActions>
		</Form>
	)
}

export default UpdateBasicInfoForm
