import { SortOrder } from 'enums/sortOrder'
import { Pagination } from 'models/pagination'

export interface BasicComicParams extends Pagination {
	creatorSlug?: string
	titleSubstring?: string
	sortOrder?: SortOrder
}
