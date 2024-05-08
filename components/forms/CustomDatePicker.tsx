import React from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'

interface Props {
	name: string
	className?: string
}

const CustomDatePicker: React.FC<Props> = ({ className = '', name }) => {
	const { setValue, control } = useFormContext()
	return (
		<div className={className}>
			<LocalizationProvider dateAdapter={AdapterDayjs}>
				<Controller
					control={control}
					name={name}
					render={({ field }) => (
						<DatePicker
							className='issue-release-date'
							{...field}
							format='DD/MM/YYYY'
							value={field.value ? dayjs(field.value) : null}
							onChange={(date) => {
								field.onChange(date?.toDate() ?? null)
								setValue(name, dayjs(date).toDate(), { shouldValidate: true })
							}}
						/>
					)}
				/>
			</LocalizationProvider>
		</div>
	)
}

export default CustomDatePicker
