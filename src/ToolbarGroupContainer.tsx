import * as React from 'react'

/** Displays (2) buttons stacked in the toolbar. */
const ToolbarGroupContainer: React.FC<{children: React.ReactNode}> = ({children}) => {
	return (
		<div className='ska-toolbar__group-container'>
			{children}
		</div>
	)
}

export default ToolbarGroupContainer
