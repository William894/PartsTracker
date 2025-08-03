interface Part {
    partNumber: { type: String, required: true },
    description: { type: String },
    quantityOnHand: { type: Number },
    locationCode: { type: String },
    lastStockCheckDate: { type: Date, default: null },
    isDeleted: { type: Boolean, default: false }
}

export default Part;