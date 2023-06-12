import { InputHTMLAttributes, useMemo, useState } from 'react'
import { cloneDeep, remove } from 'lodash'
import { ClickAwayListener } from '@mui/material'
import clsx from 'clsx'

import { SelectOption } from 'types/SelectOption'
import DropdownIcon from 'public/assets/vector-icons/dropdown.svg'
import CloseIcon from 'public/assets/vector-icons/close.svg'

import Input from './Input'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
	options: SelectOption[]
	onSelect: (selectedOptions: SelectOption[]) => void
	isSearchable?: boolean
	isMultipleSelect?: boolean
}

const Select: React.FC<Props> = ({
	options,
	onSelect,
	className,
	isSearchable = false,
	isMultipleSelect = false,
	...props
}) => {
	const [searchTerm, setSearchTerm] = useState('')
	const [selectedOptions, setSelectedOptions] = useState<SelectOption[]>([])
	const [isDropdownOpen, setIsDropdownOpen] = useState(false)

	const filteredOptions = useMemo(
		() =>
			isSearchable
				? options.filter(
						(option) =>
							option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
							option.value.toLowerCase().includes(searchTerm.toLowerCase())
				  )
				: options,
		[isSearchable, options, searchTerm]
	)

	const handleSearchTermChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (!isSearchable) return
		setSearchTerm(event.target.value)
	}

	const unselectOption = (value: string) => {
		setSelectedOptions((currentSelectedOptions) => {
			const deepClonedCurrentSelectedOptions = cloneDeep(currentSelectedOptions)
			remove(deepClonedCurrentSelectedOptions, (selectedOption) => selectedOption.value === value)
			return deepClonedCurrentSelectedOptions
		})
	}

	const checkIsOptionSelected = (value: string) => {
		return selectedOptions.some((selectedOption) => selectedOption.value === value)
	}

	const handleSelectOption = (value: string) => {
		const isOptionAlreadySelected = checkIsOptionSelected(value)

		const selectedOption = options.find((option) => option.value === value)

		if (!selectedOption) return

		if (!isMultipleSelect && !isOptionAlreadySelected) {
			setSelectedOptions([selectedOption])

			if (!isSearchable) setSearchTerm(selectedOption.label)

			return
		}

		if (isOptionAlreadySelected) {
			unselectOption(value)
			return
		}

		setSelectedOptions((currentSelectedOptions) => [...currentSelectedOptions, selectedOption])
		onSelect([...selectedOptions, selectedOption])
	}

	const handleUnselectOption = (value: string) => {
		const isOptionAlreadySelected = checkIsOptionSelected(value)

		if (isOptionAlreadySelected) unselectOption(value)
	}

	return (
		<div className='select'>
			<ClickAwayListener onClickAway={() => setIsDropdownOpen(false)}>
				<div className='input-wrapper'>
					<div className='input-icon-wrapper'>
						<Input
							className={clsx('select-search', className, { 'select-search--disabled': !isSearchable })}
							onChange={handleSearchTermChange}
							value={searchTerm}
							onFocus={() => setIsDropdownOpen(true)}
							{...props}
						/>
						<DropdownIcon className={clsx('dropdown-icon', { 'dropdown-icon--open': isDropdownOpen })} />
					</div>
					<div className='dropdown'>
						{isDropdownOpen &&
							filteredOptions.map((option) => (
								<div
									key={option.value}
									className={clsx('option', { 'option--selected': checkIsOptionSelected(option.value) })}
									onClick={() => handleSelectOption(option.value)}
								>
									{option.icon && <span className='option-icon'>{option.icon}</span>}
									{option.label}
								</div>
							))}
					</div>
				</div>
			</ClickAwayListener>

			{isMultipleSelect && (
				<div>
					{selectedOptions.map((selectedOption) => (
						<span
							key={selectedOption.value}
							className='selected-option'
							onClick={() => handleUnselectOption(selectedOption.value)}
						>
							{selectedOption.icon && <span className='option-icon'>{selectedOption.icon}</span>}
							{selectedOption.label} <CloseIcon className='selected-option-close-icon' />
						</span>
					))}
				</div>
			)}
		</div>
	)
}

export default Select
