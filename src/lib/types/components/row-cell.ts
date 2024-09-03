export type RowCell = {
	key: string
	label: string
	value: any
	isStatus?: boolean
	isTag?: boolean
	isJson?: boolean
	isLink?: boolean
	isStatic?: boolean
	isModal?: boolean
	modalModalHtml?: boolean
	transform?: (value: any, context: RowCell[]) => any
}
