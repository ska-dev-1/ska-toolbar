import {__, _n, sprintf} from '@wordpress/i18n'

import {
	useCallback,
} from '@wordpress/element'

import {
	useDispatch,
	useSelect,
} from '@wordpress/data'

import {
	store as noticesStore,
} from '@wordpress/notices'

import {
	store as blocksStore,
} from '@wordpress/blocks'

import {
	store as blockEditorStore,
} from '@wordpress/block-editor'

const useNotifyCopy = () => {

	const {
		getBlockName,
	} = useSelect(blockEditorStore, [])

	const {
		getBlockType,
	} = useSelect(blocksStore, [])

	const {
		createSuccessNotice,
	} = useDispatch(noticesStore)

	return useCallback((eventType: string, selectedBlockClientIds: string[]) => {
		let notice = ''
		if(selectedBlockClientIds.length === 1) {
			const clientId = selectedBlockClientIds[0]
			const title = getBlockType(getBlockName(clientId))?.title
			notice = eventType === 'copy'
				? sprintf(__('Copied "%s" to clipboard.', 'ska-toolbar'), title)
				: sprintf(__('Moved "%s" to clipboard.', 'ska-toolbar'), title)
		} else {
			notice = eventType === 'copy'
				? sprintf(_n('Copied %d block to clipboard.', 'Copied %d blocks to clipboard.', selectedBlockClientIds.length, 'ska-toolbar'), selectedBlockClientIds.length)
				: sprintf(_n('Moved %d block to clipboard.', 'Moved %d blocks to clipboard.', selectedBlockClientIds.length, 'ska-toolbar'), selectedBlockClientIds.length)
		}
		if(notice) {
			createSuccessNotice(notice, {type: 'snackbar'})
		}
	}, [getBlockName, getBlockType, createSuccessNotice])
}

export default useNotifyCopy
