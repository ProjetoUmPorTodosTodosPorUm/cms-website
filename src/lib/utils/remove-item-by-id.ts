export function removeItemById(id: string, data: any[]) {
	let indexOfItemToBeRemoved = -1

	for (let i = 0; i < data.length; i++) {
		if (data[i].id == id) {
			indexOfItemToBeRemoved = i
			break
		}
	}

	if (indexOfItemToBeRemoved >= 0) {
		data.splice(indexOfItemToBeRemoved, 1)
		return data
	} else {
		return data
	}
}
