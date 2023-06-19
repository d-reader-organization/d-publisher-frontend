import { SelectInputField } from './selectInputField'

export type CreateIssueFormData = {
	title: string
	issueNumber: number
	authors: SelectInputField[]
	signature: string
}
