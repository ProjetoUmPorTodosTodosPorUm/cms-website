import type { FileDto } from '$types'

export function fromFilenameToFileDto(input: string | string[]) {
	if (typeof input === 'string') {
		return { name: input } as FileDto
	} else {
		return input.map((filename) => ({ name: filename } as FileDto))
	}
}
