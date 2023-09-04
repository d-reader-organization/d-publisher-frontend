export interface Genre {
	name: string
	slug: string
	icon: string
	color: string
	priority: number
	isDeleted: boolean
}

export type CreateGenreData = Pick<Genre, 'name' | 'icon' | 'color' | 'priority'>

export type UpdateGenreData = Partial<Pick<CreateGenreData, 'priority' | 'color'>>
