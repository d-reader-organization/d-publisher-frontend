'use client'

import Header from 'components/layout/Header'
import Steps from 'components/Steps'
import Button from 'components/Button'
import Label from 'components/Label'
import LogoIcon from 'public/assets/vector-icons/logo-with-text.svg'
import ArrowRightIcon from 'public/assets/vector-icons/arrow-right.svg'
import { useFetchMe } from 'api/creator'
import { useRouter } from 'next/navigation'
import { RoutePath } from 'enums/routePath'
import FileUpload from 'components/FileUpload'
import { useUpdateCreatorFiles } from 'api/creator/queries/useUpdateCreatorFiles'
import { UpdateCreatorFilesData } from 'models/creator'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Resolver } from 'react-hook-form'
import { visualIdentityValidationSchema } from '../schemas'
import useAuthenticatedRoute from '@/hooks/useCreatorAuthenticatedRoute'

export default function UpdateCreatorVisualIdentityPage() {
	const router = useRouter()
	const { data: me } = useFetchMe()
	const {
		register,
		setValue,
		handleSubmit: onSubmit,
	} = useForm<UpdateCreatorFilesData>({
		defaultValues: {
			avatar: undefined,
			banner: undefined,
			logo: undefined,
		},
		resolver: yupResolver(visualIdentityValidationSchema) as Resolver<UpdateCreatorFilesData>,
	})
	const { mutateAsync: updateCreatorFiles } = useUpdateCreatorFiles(me?.slug || '')

	useAuthenticatedRoute(RoutePath.Register)

	const onNextClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault()
		onSubmit(handleFormSubmit)()
	}

	const handleFormSubmit = async (data: UpdateCreatorFilesData) => {
		const formData = new FormData()

		if (data.avatar) formData.append('avatar', data.avatar)
		if (data.banner) formData.append('banner', data.banner)
		if (data.logo) formData.append('logo', data.logo)

		try {
			await updateCreatorFiles(formData)
			router.push(RoutePath.RegisterConnectSocials)
		} catch {
			// do something?
		}
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

			<main className='register-page register-page--visual-identity'>
				<h1 className='title'>Hello sexy!</h1>

				<form className='form'>
					<Label isRequired tooltipText='.jpg and .jpeg preferred if no transparency'>
						Add profile avatar & cover
					</Label>
					<div className='description'>Recommended sizes are 500 x 500px for avatar and 680 x 320px for cover</div>
					<div className='profile-assets-upload'>
						<FileUpload
							id='banner-upload'
							label='Upload cover'
							className='banner-upload'
							onFileObtain={(files) => {
								setValue('banner', files[0].file)
							}}
							ref={register('banner').ref}
							previewUrl={me?.banner}
						/>
						<FileUpload
							id='avatar-upload'
							label='Upload avatar'
							className='avatar-upload'
							onFileObtain={(files) => {
								setValue('avatar', files[0].file)
							}}
							ref={register('avatar').ref}
							previewUrl={me?.avatar}
						/>
					</div>
					<Button onClick={onNextClick} backgroundColor='green-100' className='action-button'>
						Next <ArrowRightIcon className='action-button-icon' />
					</Button>
				</form>
			</main>

			{/* TODO: "Go Back" button */}
		</>
	)
}
