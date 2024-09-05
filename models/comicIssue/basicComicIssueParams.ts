import { SortOrder } from 'enums/sortOrder'
import { Pagination } from 'models/pagination'

export interface BasicComicIssueParams extends Pagination {
	creatorSlug?: string
	comicSlug?: string
	titleSubstring?: string
	sortOrder?: SortOrder
}

