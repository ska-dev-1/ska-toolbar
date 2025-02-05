import * as React from 'react'
import {__, _n} from '@wordpress/i18n'

import {
	useDispatch,
	useSelect,
} from '@wordpress/data'

import {
	// @ts-ignore
	hasBlockSupport,
	// @ts-ignore
	createBlock,
	// @ts-ignore
	cloneBlock,
	store as blocksStore,
} from '@wordpress/blocks'

import {
	store as blockEditorStore,
} from '@wordpress/block-editor'

import useNotifyCopy from './use-copy-notify'

export interface BlockActionsProps {
	clientIds: string[]
	children: (actions: {
		rootClientId: string,
		blocks: any[],
		hasParent: boolean,
		hasChildren: boolean,
		hasPeers: boolean,
		hasMetadata: boolean,
		canDuplicate: boolean,
		canInsertDefaultBlock: boolean,
		canMove: boolean,
		canRemove: boolean,
		onRemove: () => void,
		onSelectParent: () => void,
		onSelectPeers: () => void,
		onDuplicate: () => void,
		onInsertBefore: () => void,
		onInsertAfter: () => void,
		onMoveTo: () => void,
		onGroup: () => void,
		onUngroup: () => void,
		onCopy: () => void,
		onCut: () => void,
		onStripMetadata: () => void,
	}) => React.ReactNode
	__experimentalUpdateSelection: boolean
}

const BlockActions: React.FC<BlockActionsProps> = ({
	clientIds,
	children,
	__experimentalUpdateSelection: updateSelection,
}) => {

	const {
		getDefaultBlockName,
		getGroupingBlockName,
	} = useSelect(blocksStore, [])

	const {
		canInsertBlockType,
		getBlockRootClientId,
		getBlocksByClientId,
		getBlock,
		getBlockParents,
		canMoveBlocks,
		canRemoveBlocks,
		getBlockAttributes,
	} = useSelect(blockEditorStore, [])

	const {
		removeBlocks,
		replaceBlocks,
		duplicateBlocks,
		insertAfterBlock,
		insertBeforeBlock,
		flashBlock,
		setBlockMovingClientId,
		setNavigationMode,
		selectBlock,
		multiSelect,
		updateBlockAttributes,
	} = useDispatch(blockEditorStore)

	const block = getBlock(clientIds[0])
	const blocks = getBlocksByClientId(clientIds) as any[]
	const rootClientId = getBlockRootClientId(clientIds[0])
	const blockParents = getBlockParents(clientIds[0], true)

	const hasParent = !!blockParents[0]
	const hasChildren = block.innerBlocks.length > 0
	const parent = hasParent ? getBlock(blockParents[0]) : undefined
	const hasPeers = hasParent && parent.innerBlocks.length > 1

	const canDuplicate = blocks.every(block => {
		return (
			!!block &&
			hasBlockSupport(block.name, 'multiple', true) &&
			canInsertBlockType(block.name, rootClientId)
		)
	})

	const canInsertDefaultBlock = canInsertBlockType(getDefaultBlockName(), rootClientId)
	const canMove = canMoveBlocks(clientIds, rootClientId)
	const canRemove = canRemoveBlocks(clientIds, rootClientId)

	const notifyCopy = useNotifyCopy()

	const onRemove = () => removeBlocks(clientIds, updateSelection)

	const hasMetadata = clientIds.length === 1
		? Object(getBlockAttributes(clientIds[0])).hasOwnProperty('metadata') && !!getBlockAttributes(clientIds[0]).metadata
		: false

	return children({
		rootClientId,
		blocks,
		hasParent,
		hasChildren,
		hasPeers,
		hasMetadata,
		canDuplicate,
		canInsertDefaultBlock,
		canMove,
		canRemove,
		onRemove,
		onSelectParent() {
			selectBlock(blockParents[0])
		},
		onSelectPeers() {
			multiSelect(
				parent.innerBlocks[0].clientId,
				parent.innerBlocks[parent.innerBlocks.length - 1].clientId
			)
		},
		onDuplicate() {
			duplicateBlocks(clientIds, updateSelection)
		},
		onInsertBefore() {
			const clientId = Array.isArray(clientIds) ? clientIds[0] : clientIds
			insertBeforeBlock(clientId)
		},
		onInsertAfter() {
			const clientId = Array.isArray(clientIds) ? clientIds[clientIds.length - 1] : clientIds
			insertAfterBlock(clientId)
		},
		onMoveTo() {
			setNavigationMode(true)
			selectBlock(clientIds[0])
			setBlockMovingClientId(clientIds[0])
		},
		onGroup() {
			if(!blocks.length) {
				return
			}
			const groupingBlockName = getGroupingBlockName()
			replaceBlocks(clientIds, [createBlock(groupingBlockName, {}, blocks.map(block => cloneBlock(block)))])
		},
		onUngroup() {
			if(!blocks.length) {
				return
			}
			const innerBlocks = blocks[0].innerBlocks
			if(!innerBlocks.length) {
				return
			}
			replaceBlocks(clientIds, innerBlocks)
		},
		onCopy() {
			const selectedBlockClientIds = blocks.map(({clientId}) => clientId)
			if(blocks.length === 1) {
				flashBlock(selectedBlockClientIds[0])
			}
			notifyCopy('copy', selectedBlockClientIds)
		},
		onCut() {
			const selectedBlockClientIds = blocks.map(({clientId}) => clientId)
			if(blocks.length === 1) {
				flashBlock(selectedBlockClientIds[0])
			}
			notifyCopy('cut', selectedBlockClientIds)
			onRemove()
		},
		onStripMetadata() {
			updateBlockAttributes(clientIds[0], {metadata: undefined})
		},
	})
}

export default BlockActions
