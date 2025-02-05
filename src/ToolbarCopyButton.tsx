import * as React from 'react'
import {__, _n} from '@wordpress/i18n'

import {
	ToolbarButton,
} from '@wordpress/components'

import {
	// @ts-ignore
	serialize,
} from '@wordpress/blocks'

import {
	useCopyToClipboard,
} from '@wordpress/compose'

const ToolbarCopyButton = ({blocks, onCopy, ...props}: any) => {
	const ref = useCopyToClipboard(() => serialize(blocks), onCopy)
	return <ToolbarButton ref={ref} {...props} />
}

export default ToolbarCopyButton
