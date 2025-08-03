export interface ApiError {
    type: string
    title: string
    status: number
    detail: string
    errors: Error[]
}

export interface Error {
    field: string
    message: string
}