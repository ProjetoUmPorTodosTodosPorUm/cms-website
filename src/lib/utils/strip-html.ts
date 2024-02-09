import { browser } from '$app/environment'

export function stripHtml(html: string) {
	if (browser) {
		let tmp = document.createElement('DIV')
		tmp.innerHTML = html
		return tmp.textContent || tmp.innerText || ''
	} else {
		return html
	}
}
