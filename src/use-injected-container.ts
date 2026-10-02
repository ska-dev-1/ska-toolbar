import {
	useState,
	useEffect,
	useCallback,
} from '@wordpress/element'

import {
	subscribe,
} from '@wordpress/data'

export type ContainerAttributes = {
	tagName?: string
	id: string
	className?: string
	[key: string]: string | undefined
}

const injectContainer = ({tagName = 'div', id: containerId, className = '', ...attrs}: ContainerAttributes, selector: string) => {

	if(document.getElementById(containerId)) {
		return false
	}

	const anchor = document.querySelector(selector)
	if(!anchor) {
		return false
	}

	const container = document.createElement(tagName)
	container.setAttribute('id', containerId)
	if(className) {
		container.setAttribute('class', className)
	}
	Object.entries(attrs).forEach(([k, v = '']) => {
		container.setAttribute(k, v)
	})
	anchor.after(container)

	return true
}

export const useInjectedContainer = (containerAttrs: ContainerAttributes, selector: string) => {

	const [container, setContainer] = useState<HTMLElement | null>(null)

	const injector = useCallback(() => {

		const {
			id: containerId,
		} = containerAttrs

		if(!container && document.getElementById(containerId)) {
			setContainer(document.getElementById(containerId) as HTMLElement | null)
			return
		}

		if(injectContainer(containerAttrs, selector)) {
			setContainer(document.getElementById(containerId) as HTMLElement | null)
		}
	}, [containerAttrs, selector, container])

	useEffect(() => {

		let throttleTimeout: ReturnType<typeof setTimeout> | undefined
		const throttle = (fn: () => any, delay: number) => {

			let isThrottled = false

			return () => {

				if(isThrottled) {
					return
				}

				fn()

				isThrottled = true
				throttleTimeout = setTimeout(() => {
					isThrottled = false
					fn()
				}, delay)
			}
		}

		const throttledInjector = throttle(injector, 2500)
		const unsubscribe = subscribe(throttledInjector)

		return () => {
			clearTimeout(throttleTimeout)
			unsubscribe()
		}
	}, [injector])

	return container
}
