import { SortOrder } from 'enums/sortOrder'
import { Pagination } from 'models/pagination'

export interface SearchComicParams extends Pagination {
	creatorSlug?: string
	search?: string
	sortOrder?: SortOrder
}
