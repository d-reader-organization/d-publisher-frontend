import {
	generateMaxLengthErrorMessage,
	generateMinLengthErrorMessage,
	generateMinNumberErrorMessage,
	generateRequiredArrayElementErrorMessage,
	yupRequiredMessage,
} from 'utils/error'
import * as yup from 'yup'

export const createComicIssueValidationSchema = yup.object().shape({
	title: yup
		.string()
		.required(yupRequiredMessage('Title'))
		.min(3, generateMinLengthErrorMessage('title', 3))
		.max(20, generateMaxLengthErrorMessage('title', 20)),
	number: yup
		.number()
		.required(yupRequiredMessage('Issue number'))
		.positive()
		.integer()
		.min(1, generateMinNumberErrorMessage('issue number', 1)),
	description: yup
		.string()
		.required(yupRequiredMessage('Description'))
		.min(0, generateMinLengthErrorMessage('description', 0))
		.max(256, generateMaxLengthErrorMessage('description', 256)),
	flavorText: yup.string().notOneOf([undefined]).max(128, generateMaxLengthErrorMessage('flavorText', 128)),
	creatorAddress: yup.string(),
	comicSlug: yup.string().required(),
	releaseDate: yup.date().required(),
	isFreeToRead: yup.boolean().required(),
	collaborators: yup
		.array()
		.of(
			yup.object({
				role: yup.string().required(generateRequiredArrayElementErrorMessage('collaborators list')),
				name: yup.string().required(generateRequiredArrayElementErrorMessage('collaborators list')),
			})
		)
		.required(yupRequiredMessage('Collaborators list'))
		.min(1, yupRequiredMessage('Collaborators list')),
})
