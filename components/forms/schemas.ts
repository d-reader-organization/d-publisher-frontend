import {
	generateMaxLengthErrorMessage,
	generateMinLengthErrorMessage,
	generateMinNumberErrorMessage,
	generateNotCheckedErrorMessage,
	generateRequiredArrayElementErrorMessage,
	yupRequiredMessage,
} from 'utils/error'
import * as yup from 'yup'
import 'yup.extensions'
import dayjs from 'dayjs'

export const updateCreatorValidationSchema = yup.object().shape({
	description: yup.string().max(512, generateMaxLengthErrorMessage('description', 512)),
	flavorText: yup.string().max(128, generateMaxLengthErrorMessage('flavor text', 128)),
	tippingAddress: yup.string().max(128, generateMaxLengthErrorMessage('tipping address', 128)),
})

export const updateComicValidationSchema = yup.object().shape({
	genres: yup
		.array()
		.of(yup.string())
		.required(yupRequiredMessage('Genres'))
		.min(1, 'At least 1 genre should be selected')
		.max(5, 'Maximum 5 genres can be selected'),
	audienceType: yup.string().required(yupRequiredMessage('Audience type')),
	isCompleted: yup.boolean().required(yupRequiredMessage('Current status')),
	description: yup
		.string()
		.required(yupRequiredMessage('Description'))
		.min(0, generateMinLengthErrorMessage('description', 0))
		.max(1024, generateMaxLengthErrorMessage('description', 1024)),
	flavorText: yup.string().notOneOf([undefined]).max(128, generateMaxLengthErrorMessage('flavorText', 128)),
})
export const updateComicIssueValidationSchema = yup.object().shape({
	description: yup
		.string()
		.required(yupRequiredMessage('Description'))
		.min(0, generateMinLengthErrorMessage('description', 0))
		.max(1024, generateMaxLengthErrorMessage('description', 1024)),
	flavorText: yup.string().notOneOf([undefined]).max(128, generateMaxLengthErrorMessage('flavorText', 128)),
})

export const visualIdentityValidationSchema = yup.object().shape({
	avatar: yup.mixed(),
	banner: yup.mixed(),
})

export const connectSocialsValidationSchema = yup.object().shape({
	website: yup.string(),
	twitter: yup.string().noSlash('Provide only the Twitter handle'),
	instagram: yup.string().noSlash('Provide only the Instagram handle'),
	lynkfire: yup.string().noSlash('Provide only the Linkfire handle'),
})

export const loginValidationSchema = yup.object().shape({
	nameOrEmail: yup.string().required(yupRequiredMessage('Email')),
	password: yup.string().required(yupRequiredMessage('Password')),
})

export const registerValidationSchema = yup.object().shape({
	name: yup
		.string()
		.required(yupRequiredMessage('Name'))
		.min(2, generateMinLengthErrorMessage('name', 2))
		.max(20, generateMaxLengthErrorMessage('name', 20)),
	email: yup.string().email().required(yupRequiredMessage('Email')),
	password: yup.string().required(yupRequiredMessage('Password')),
})

export const yourDetailsValidationSchema = yup.object().shape({
	description: yup.string().max(512, generateMaxLengthErrorMessage('description', 512)),
	flavorText: yup.string().max(128, generateMaxLengthErrorMessage('flavor text', 128)),
})

export const connectComicSocialsValidationSchema = yup.object().shape({
	website: yup.string(),
	twitter: yup.string().noSlash('Provide only the Twitter handle'),
	discord: yup.string(),
	instagram: yup.string().noSlash('Provide only the Instagram handle'),
	telegram: yup.string().noSlash('Provide only the Telegram handle'),
	tikTok: yup.string().noSlash('Provide only the Tiktok handle'),
	youTube: yup.string().noSlash('Provide only the Youtube handle'),
})

export const createComicValidationSchema = yup.object().shape({
	title: yup
		.string()
		.required(yupRequiredMessage('Title'))
		.min(1, generateMinLengthErrorMessage('title', 1))
		.max(48, generateMaxLengthErrorMessage('title', 48)),
	genres: yup
		.array()
		.of(yup.string())
		.required(yupRequiredMessage('Genres'))
		.min(1, 'At least 1 genre should be selected')
		.max(5, 'Maximum 5 genres can be selected'),
	audienceType: yup.string().required(yupRequiredMessage('Audience type')),
	isCompleted: yup.boolean().required(yupRequiredMessage('Current status')),
	description: yup
		.string()
		.required(yupRequiredMessage('Description'))
		.min(0, generateMinLengthErrorMessage('description', 0))
		.max(1024, generateMaxLengthErrorMessage('description', 1024)),
	flavorText: yup.string().notOneOf([undefined]).max(128, generateMaxLengthErrorMessage('flavorText', 128)),
	// collaborators: yup
	// 	.array()
	// 	.of(
	// 		yup.object({
	// 			role: yup.string().required(generateRequiredArrayElementErrorMessage('collaborators list')),
	// 			name: yup.string().required(generateRequiredArrayElementErrorMessage('collaborators list')),
	// 		})
	// 	)
	// 	.required(yupRequiredMessage('Collaborators list'))
	// 	.min(1, yupRequiredMessage('Collaborators list')),
	ownershipConfirmation: yup
		.boolean()
		.required()
		.oneOf([true], generateNotCheckedErrorMessage('Ownership confirmation')),
	authorAgreement: yup
		.boolean()
		.required()
		.oneOf([true], generateNotCheckedErrorMessage('Author registration and uploading agreement')),
})

export const uploadComicAssetsValidationSchema = yup.object().shape({
	cover: yup.mixed(),
	logo: yup.mixed(),
	banner: yup.mixed(),
})

export const createComicIssueValidationSchema = yup.object().shape({
	title: yup
		.string()
		.required(yupRequiredMessage('Title'))
		.min(3, generateMinLengthErrorMessage('title', 3))
		.max(48, generateMaxLengthErrorMessage('title', 48)),
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
		.max(1024, generateMaxLengthErrorMessage('description', 1024)),
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

export const uploadComicIssuePdfValidationSchema = yup.object().shape({
	pdf: yup.mixed(),
})

export const createDraftComicIssueSalesDataValidationSchema = yup.object().shape({
	comicIssueId: yup.number().required(),
	revenueMin: yup.number().min(0).default(0),
	revenueMax: yup
		.number()
		.min(0)
		.default(0)
		.test('is-greater', 'revenueMax must be greater than revenueMin', function (value) {
			const revenueMin = this.parent.revenueMin
			return value > revenueMin
		}),
	supplyMin: yup.number().min(0).default(0),
	supplyMax: yup
		.number()
		.min(0)
		.default(0)
		.test('is-greater-supply', 'supplyMax must be greater than supplyMin', function (value) {
			const supplyMin = this.parent.supplyMin
			return value > supplyMin
		}),
	launchDateMin: yup.date(),
	launchDateMax: yup
		.date()
		.test('is-greater-launch-date', 'launchDateMax must be greater than launchDateMin', function (value) {
			const maxDate = dayjs(value)
			const minDate = dayjs(this.parent.launchDateMin)

			return maxDate.diff(minDate) >= 0
		}),
	currencies: yup
		.array()
		.of(yup.string())
		.required(yupRequiredMessage('Select at least 1 currency'))
		.min(1, 'At least 1 currency should be selected'),
	royaltyBasisPoint: yup.number().min(0).max(10000).default(0),
	royaltyAddress: yup.string().default(''),
	note: yup.string().default(''),
})

export const resetPasswordValidationSchema = yup.object().shape({
	verificationToken: yup.string().required(yupRequiredMessage('Verification token')),
	newPassword: yup.string().required(yupRequiredMessage('New password')),
})
