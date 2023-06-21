import React from 'react'
import { NextPage } from 'next'
import { FieldErrors, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

import Publisher from 'components/layout/Publisher'
import Header from 'components/layout/Header'
import Steps from 'components/Steps'
import Label from 'components/Label'
import Input from 'components/Input'
import IntegerInput from 'components/IntegerInput'
import SelectWithInput from 'components/SelectWithInput'
import FileUpload from 'components/FileUpload'
import Button from 'components/Button'
import { CreateIssueFormData } from 'types/createIssueFormData'
import { SelectOption } from 'types/SelectOption'
import ArrowRightIcon from 'public/assets/vector-icons/arrow-right.svg'
import {
	generateMaxLengthErrorMessage,
	generateMinLengthErrorMessage,
	generateMinNumberErrorMessage,
	generateRequiredArrayElementErrorMessage,
	generateRequiredErrorMessage,
} from 'utils/error'
import { useToaster } from 'providers/ToastProvider'
import { useRouter } from 'next/router'

const ROLES: SelectOption[] = [
	{
		label: 'Illustrator',
		value: 'illustrator',
	},
	{
		label: 'Writer',
		value: 'writer',
	},
	{
		label: 'Artist',
		value: 'artist',
	},
	{
		label: 'Colorist',
		value: 'colorist',
	},
	{
		label: 'Editor',
		value: 'editor',
	},
]

const validationSchema = yup.object().shape({
	title: yup
		.string()
		.required(generateRequiredErrorMessage('Title'))
		.min(3, generateMinLengthErrorMessage('title', 3))
		.max(20, generateMaxLengthErrorMessage('title', 20)),
	issueNumber: yup
		.number()
		.required(generateRequiredErrorMessage('Issue number'))
		.positive()
		.integer()
		.min(1, generateMinNumberErrorMessage('issue number', 1)),
	authors: yup
		.array()
		.of(
			yup.object({
				selectValue: yup.string().required(generateRequiredArrayElementErrorMessage('authors list')),
				inputValue: yup.string().required(generateRequiredArrayElementErrorMessage('authors list')),
			})
		)
		.required(generateRequiredErrorMessage('Authors list'))
		.min(1, generateRequiredErrorMessage('Authors list')),
	signature: yup.string().required(generateRequiredErrorMessage('Logo')),
})

const CreateIssuePage: NextPage = () => {
	const toaster = useToaster()
	const router = useRouter()
	const { register, setValue, getValues, watch, handleSubmit } = useForm<CreateIssueFormData>({
		defaultValues: {
			title: '',
			issueNumber: 0,
			authors: [],
			signature: '',
		},
		resolver: yupResolver(validationSchema),
	})

	const onSubmitClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault()
		handleSubmit((data) => {
			handleFormSubmit(data)
		}, handleFormError)()
	}

	const handleFormSubmit = (data: CreateIssueFormData) => {
		toaster.add('Successfuly created new comic issue', 'success')
		router.push(`/comic/${router.query.comicId}/issue/upload-assets`)
	}

	const handleFormError = (errors: FieldErrors<CreateIssueFormData>) => {
		const [_, errorValue] = Object.entries(errors)[0]
		let errorMessage = 'Error while submitting the form'

		if (Array.isArray(errorValue))
			errorMessage = Object.entries(errorValue.filter((value) => value)[0] as object)[0][1].message
		else if (typeof errorValue === 'object' && !Array.isArray(errorValue) && errorValue.message)
			errorMessage = errorValue.message

		toaster.add(errorMessage, 'error')
	}
	return (
		<Publisher>
			<Header title='Create Issue' />
			<Steps
				steps={[
					{ label: '01 Create Issue', isActive: true },
					{ label: '02 Upload assets', isActive: false },
					{ label: '03 Upload pages', isActive: false },
					{ label: '04 Publish', isActive: false },
				]}
			/>
			<form className='form'>
				<Label isRequired>Issue title</Label>
				<Input {...register('title')} placeholder='Name of the episode' />
				<div className='issue-number-wrapper'>
					<div>
						<Label isRequired>Issue number</Label>
						<p className='description'>Choose the episode number</p>
					</div>
					<IntegerInput
						ref={register('issueNumber').ref}
						value={watch('issueNumber')}
						onChange={(increment) => {
							const currentIssueNumber = getValues('issueNumber')
							setValue('issueNumber', currentIssueNumber + increment)
						}}
					/>
				</div>
				<Label isRequired>Authors list</Label>
				<SelectWithInput
					ref={register('authors').ref}
					options={ROLES}
					onChange={(inputs) => setValue('authors', inputs)}
				/>
				<Label isRequired tooltipText='.png, .gif with transparent background'>
					Personal signature
				</Label>
				<div className='description'>Upload a photo with your signature used for signing the comic covers</div>
				<FileUpload
					id='signature-upload'
					label='Upload your signature'
					onUpload={(urls) => {
						setValue('signature', urls[0])
					}}
					className='signature-upload'
				/>
				<Button type='submit' onClick={onSubmitClick} backgroundColor='grey-100' className='action-button'>
					Next <ArrowRightIcon className='action-button-icon' />
				</Button>
			</form>
		</Publisher>
	)
}

export default CreateIssuePage
