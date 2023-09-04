import {
	generateMaxLengthErrorMessage,
	generateMinLengthErrorMessage,
	generateNotCheckedErrorMessage,
	yupRequiredMessage,
} from 'utils/error'
import * as yup from 'yup'

export const connectSocialsValidationSchema = yup.object().shape({
	website: yup.string().max(30, generateMaxLengthErrorMessage('website', 30)),
	twitter: yup.string().max(30, generateMaxLengthErrorMessage('twitter', 30)),
	discord: yup.string().max(30, generateMaxLengthErrorMessage('discord', 30)),
	instagram: yup.string().max(30, generateMaxLengthErrorMessage('instagram', 30)),
	telegram: yup.string().max(30, generateMaxLengthErrorMessage('telegram', 30)),
	tikTok: yup.string().max(30, generateMaxLengthErrorMessage('tikTok', 30)),
	youTube: yup.string().max(30, generateMaxLengthErrorMessage('youTube', 30)),
})

export const createComicValidationSchema = yup.object().shape({
	title: yup
		.string()
		.required(yupRequiredMessage('Title'))
		.min(3, generateMinLengthErrorMessage('title', 3))
		.max(20, generateMaxLengthErrorMessage('title', 20)),
	genres: yup
		.array()
		.of(yup.string())
		.required(yupRequiredMessage('Genres'))
		.min(1, 'At least 1 genre should be selected'),
	audienceType: yup.string().required(yupRequiredMessage('Audience type')),
	isCompleted: yup.boolean().required(yupRequiredMessage('Current status')),
	description: yup
		.string()
		.required(yupRequiredMessage('Description'))
		.min(0, generateMinLengthErrorMessage('description', 0))
		.max(256, generateMaxLengthErrorMessage('description', 256)),
	flavorText: yup.string().notOneOf([undefined]).max(128, generateMaxLengthErrorMessage('flavorText', 128)),
	ownershipConfirmation: yup
		.boolean()
		.required()
		.oneOf([true], generateNotCheckedErrorMessage('Ownership confirmation')),
	authorAgreement: yup
		.boolean()
		.required()
		.oneOf([true], generateNotCheckedErrorMessage('Author registration and uploading agreement')),
})

export const uploadAssetsValidationSchema = yup.object().shape({
	cover: yup.mixed(),
	logo: yup.mixed(),
	pfp: yup.mixed(),
	banner: yup.mixed(),
})
