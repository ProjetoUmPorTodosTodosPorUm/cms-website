// return friendly text based on friendly enum
export function translateFromEnum(
	value: string,
	friendlyEnum: {
		[key: string]: string
	}
) {
	for (const key of Object.keys(friendlyEnum)) {
		if (value === key) {
			return friendlyEnum[key]
		}
	}
	return value
}
