import { useState } from 'react'

import CloseIcon from 'public/assets/vector-icons/close.svg'

const Checkbox = () => {
	const [isChecked, setIsChecked] = useState(false)

	return (
		<label className='checkbox'>
			<input type='checkbox' onChange={() => setIsChecked(!isChecked)} checked={isChecked} />
			{isChecked && <CloseIcon className='checked-icon' viewBox='0 0 8 8' width={10} height={10} />}
		</label>
	)
}

export default Checkbox
