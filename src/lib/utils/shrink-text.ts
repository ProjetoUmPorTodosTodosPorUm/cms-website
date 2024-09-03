export function shrinkText(text: string, maxLength = 100) {
    const length = text.length

    if (length > maxLength) {
        return `${text.substring(0, maxLength)}...`
    }
    return text
}