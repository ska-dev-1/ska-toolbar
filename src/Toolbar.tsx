import * as React from 'react'
import {__, _n} from '@wordpress/i18n'

import {
	ToolbarGroup,
	ToolbarButton,
} from '@wordpress/components'

import {
	useSelect,
} from '@wordpress/data'

import {
	store as blockEditorStore,
} from '@wordpress/block-editor'

import {
	group as groupIcon,
	ungroup as ungroupIcon,
	insertAfter as insertAfterIcon,
	insertBefore as insertBeforeIcon,
	trash as trashIcon,
	blockMeta as blockMetaIcon,
} from '@wordpress/icons'

import {
	cutIcon,
	copyIcon,
	homeButtonIcon,
} from './Icons'

import BlockActions from './BlockActions'
import ToolbarGroupContainer from './ToolbarGroupContainer'
import ToolbarCopyButton from './ToolbarCopyButton'

const Toolbar: React.FC = () => {

	const blockClientIds = useSelect(select => select(blockEditorStore).getSelectedBlockClientIds(), [])
	if(!blockClientIds.length) {
		return null
	}

	return (
		<BlockActions
			clientIds={blockClientIds}
			__experimentalUpdateSelection
		>
			{({
				blocks,
				hasChildren,
				hasMetadata,
				canDuplicate,
				canRemove,
				onDuplicate,
				onInsertAfter,
				onInsertBefore,
				onGroup,
				onUngroup,
				onRemove,
				onCopy,
				onCut,
				onStripMetadata,
			}) => (
				<ToolbarGroup className='ska-toolbar'>
					<ToolbarGroupContainer>
						<ToolbarButton
							icon={insertBeforeIcon}
							title={__('Insert before', 'ska-toolbar')}
							onClick={onInsertBefore}
						/>
						<ToolbarButton
							icon={insertAfterIcon}
							title={__('Insert after', 'ska-toolbar')}
							onClick={onInsertAfter}
						/>
					</ToolbarGroupContainer>
					<ToolbarGroupContainer>
						<ToolbarButton
							icon={groupIcon}
							title={__('Group', 'ska-toolbar')}
							onClick={onGroup}
						/>
						<ToolbarButton
							icon={homeButtonIcon}
							title={__('Ungroup', 'ska-toolbar')}
							onClick={onUngroup}
							disabled={!hasChildren}
						/>
					</ToolbarGroupContainer>
					<ToolbarGroupContainer>
						<ToolbarCopyButton
							icon={copyIcon}
							title={_n('Copy block', 'Copy blocks', blocks.length, 'ska-toolbar')}
							blocks={blocks}
							onCopy={onCopy}
						/>
						<ToolbarCopyButton
							icon={cutIcon}
							title={_n('Cut block', 'Cut blocks', blocks.length, 'ska-toolbar')}
							blocks={blocks}
							onCopy={onCut}
						/>
					</ToolbarGroupContainer>
					{(canDuplicate || canRemove) && (
						<ToolbarGroupContainer>
							<ToolbarButton
								icon={ungroupIcon}
								title={_n('Duplicate block', 'Duplicate blocks', blocks.length, 'ska-toolbar')}
								onClick={canDuplicate ? onDuplicate : undefined}
								disabled={!canDuplicate}
							/>
							<ToolbarButton
								icon={trashIcon}
								title={_n('Remove block', 'Remove blocks', blocks.length, 'ska-toolbar')}
								onClick={canRemove ? onRemove : undefined}
								disabled={!canRemove}
							/>
						</ToolbarGroupContainer>
					)}
					{hasMetadata && (
						<ToolbarGroupContainer>
							<ToolbarButton
								icon={blockMetaIcon}
								title={__('Strip metadata', 'ska-toolbar')}
								onClick={onStripMetadata}
							/>
							<span />
						</ToolbarGroupContainer>
					)}
				</ToolbarGroup>
			)}
		</BlockActions>
	)
}

export default Toolbar
