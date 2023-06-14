import React from 'react'
import { NextPage } from 'next'
import { useForm } from 'react-hook-form'

import Publisher from 'components/layout/Publisher'
import Header from 'components/layout/Header'
import Steps from 'components/Steps'
import Label from 'components/Label'
import Input from 'components/Input'

const AddIssuePage: NextPage = () => {
	const { register } = useForm()

	return (
		<Publisher>
			<Header title='Create Issue' />
			<Steps
				steps={[
					{ label: '01 Create Comic', isActive: true },
					{ label: '02 Add Issue', isActive: true },
					{ label: '03 Publish', isActive: false },
				]}
			/>
			<form className='form'>
				<Label isRequired>Issue title</Label>
				<Input {...register('title')} />
			</form>
		</Publisher>
	)
}

export default AddIssuePage
