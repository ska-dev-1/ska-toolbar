import * as React from 'react'

import {
	createPortal,
} from '@wordpress/element'

import {
	registerPlugin,
} from '@wordpress/plugins'

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

import {
	useInjectedContainer,
	type ContainerAttributes,
} from './use-injected-container'

import './style.scss'

const withToolbar = createHigherOrderComponent(
	BlockEdit => props => {
		return <>
			<BlockControls group='parent'>
				<Toolbar className='ska-toolbar--block-control' />
			</BlockControls>
			<BlockEdit {...props} />
		</>
	},
	'withSkaToolbar'
)

addFilter('editor.BlockEdit', 'ska-toolbar/with-toolbar', withToolbar)

/** Render toolbar in a similar DOM structure to the real block toolbar. */
const SkaBlockToolbar: React.FC = () => {
	return (
		<div
			role='toolbar'
			aria-orientation='horizontal'
			className='components-accessible-toolbar block-editor-block-contextual-toolbar'
		>
			<div className='block-editor-block-toolbar'>
				<div className='components-toolbar-group'>
					<div className='block-editor-block-toolbar__slot'>
						<Toolbar className='ska-toolbar--injected' />
					</div>
				</div>
			</div>
		</div>
	)
}

const CONTAINER_ATTRS: ContainerAttributes = {
	id: 'ska-toolbar',
	className: 'editor-collapsible-block-toolbar',
	tagName: 'div',
}

/** Inject the toolbar to editor header. */
const SkaToolbar: React.FC = () => {

	const container = useInjectedContainer(CONTAINER_ATTRS, '.editor-header__toolbar > .edit-post-header-toolbar')
	if(!container) {
		return null
	}

	return createPortal(<SkaBlockToolbar />, container)
}

registerPlugin('ska-toolbar', {
	render: SkaToolbar,
})
