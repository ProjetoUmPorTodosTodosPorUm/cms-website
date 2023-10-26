import type { Message } from '../types'

type generateMessagesOptions = {
	message: string
	variant?: 'danger' | 'success' | 'info'
	silent?: boolean
}

export function generateMessages(messages: generateMessagesOptions[]) {
	return messages.map(
		(msg) =>
			({
				id: Math.floor(Math.random() * Date.now()),
				message: msg.message,
				variant: msg.variant ?? 'danger',
				silent: msg.silent ?? false
			} as Message)
	)
}
