import * as React from 'react'

import {
	// @ts-ignore
	BlockControls,
} from '@wordpress/block-editor'

import {
	createHigherOrderComponent,
} from '@wordpress/compose'

import {
	addFilter,
} from '@wordpress/hooks'

import Toolbar from './Toolbar'

import './style.scss'

const withToolbar = createHigherOrderComponent(
	BlockEdit => props => {
		return <>
			<BlockControls group='parent'>
				<Toolbar {...props} />
			</BlockControls>
			<BlockEdit {...props} />
		</>
	},
	'withSkaToolbar'
)

addFilter('editor.BlockEdit', 'ska-toolbar/with-toolbar', withToolbar)
