export type Pagination = {
    itemsPerPage?: number
    page?: number
    deleted?: boolean
    orderKey?: string
    orderValue?: 'asc' | 'desc'
    search?: string
    searchSpecificField?: string
    searchSpecificValue?: any
  }