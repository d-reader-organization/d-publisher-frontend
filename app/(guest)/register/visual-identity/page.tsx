'use client'

import Header from 'components/layout/Header'
import Steps from 'components/Steps'
import Button from 'components/Button'
import Label from 'components/Label'
import LogoIcon from 'public/assets/vector-icons/logo-with-text.svg'
import ArrowRightIcon from 'public/assets/vector-icons/arrow-right.svg'
import { useUpdateCreatorFiles } from 'api/creator/queries/useUpdateCreatorFiles'
import useAuthenticatedRoute from '@/hooks/useCreatorAuthenticatedRoute'
import { useFetchMe } from 'api/creator'
import { useRouter } from 'next/navigation'
import { RoutePath } from 'enums/routePath'
import FileUpload from 'components/FileUpload'
import { UpdateCreatorFilesData } from 'models/creator'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Resolver } from 'react-hook-form'
import { visualIdentityValidationSchema } from '../schemas'
import FormActions from '@/components/FormActions'
import Form from '@/components/Form'
import usePrefetchRoute from '@/hooks/usePrefetchRoute'
import { useToaster } from '@/providers/ToastProvider'
import { creatorVisualIdentityTooltipText } from '@/constants/tooltips'

export default function UpdateCreatorVisualIdentityPage() {
	const router = useRouter()
	const toaster = useToaster()

	const nextPage = RoutePath.RegisterConnectSocials

	const { data: me } = useFetchMe()
	const { mutateAsync: updateCreatorFiles } = useUpdateCreatorFiles(me?.slug || '')

	const {
		register,
		setValue,
		handleSubmit: onSubmit,
	} = useForm<UpdateCreatorFilesData>({
		defaultValues: {
			avatar: undefined,
			banner: undefined,
		},
		resolver: yupResolver(visualIdentityValidationSchema) as Resolver<UpdateCreatorFilesData>,
	})

	usePrefetchRoute(nextPage)
	useAuthenticatedRoute(RoutePath.Register)

	const onNextClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault()
		onSubmit(handleFormSubmit, toaster.onFormError)()
	}

	const handleFormSubmit = async (data: UpdateCreatorFilesData) => {
		const formData = new FormData()

		if (data.avatar) formData.append('avatar', data.avatar)
		if (data.banner) formData.append('banner', data.banner)

		await updateCreatorFiles(formData)
		router.push(nextPage)
	}

	return (
		<>
			<Header image={<LogoIcon />} />
			<Steps
				steps={[
					{ label: '01 Create account', isActive: false },
					{ label: '02 Your details', isActive: false },
					{ label: '03 Visual Identity', isActive: true },
					{ label: '04 Connect socials', isActive: false },
					{ label: '05 Submit', isActive: false },
				]}
			/>

			<main className='register-page'>
				<h1 className='title'>Lets see your pretty face!</h1>

				<Form padding centered className='form--edit-visual-identity'>
					<Label centered isRequired tooltipText={creatorVisualIdentityTooltipText}>
						Add profile avatar & cover
					</Label>
					<div className='description'>Recommended sizes are 400 x 400px for avatar and 1920 x 900px for cover</div>
					<div className='profile-assets-upload'>
						<FileUpload
							id='banner-upload'
							label='Upload cover'
							className='banner-upload'
							onUpload={(files) => {
								setValue('banner', files[0].file)
							}}
							ref={register('banner').ref}
							previewUrl={me?.banner}
						/>
						<FileUpload
							id='avatar-upload'
							label='Upload avatar'
							className='avatar-upload'
							onUpload={(files) => {
								setValue('avatar', files[0].file)
							}}
							ref={register('avatar').ref}
							previewUrl={me?.avatar}
						/>
					</div>
					<FormActions centered marginTop>
						<Button onClick={onNextClick} backgroundColor='green-100' className='action-button'>
							Next <ArrowRightIcon className='action-button-icon' />
						</Button>
					</FormActions>
				</Form>
			</main>
		</>
	)
}
