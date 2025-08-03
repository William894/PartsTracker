export interface Part {
    partNumber: string
    description: string
    quantityOnHand: number
    locationCode: string
    lastStockCheckDate: Date | null
}