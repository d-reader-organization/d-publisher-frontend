import React from 'react'
import { Controller, Control, useForm } from 'react-hook-form'
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'

interface Props {
	name: string
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	control: Control<any>
}

const CustomDatePicker: React.FC<Props> = ({ name, control }) => {
	const { setValue } = useForm()
	return (
		<div>
			<LocalizationProvider dateAdapter={AdapterDayjs}>
				<Controller
					control={control}
					name={name}
					render={({ field }) => (
						<DatePicker
							className='issue-release-date'
							{...field}
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
