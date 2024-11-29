import { SortOrder } from 'enums/sortOrder'
import { Pagination } from 'models/pagination'

export interface SearchComicIssueParams extends Pagination {
	creatorSlug?: string
	comicSlug?: string
	search?: string
	sortOrder?: SortOrder
}
