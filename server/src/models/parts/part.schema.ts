import * as mongoose from 'mongoose';
import Part from 'interfaces/part.interface';

const partSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    description: { type: String },
    quantityOnHand: { type: Number },
    locationCode: { type: String },
    lastStockCheckDate: { type: Date, default: null },
    isDeleted: { type: Boolean, default: false }
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: function (doc, ret) {
            delete ret._id;
            return ret;
        }
    },
    toObject: {
        virtuals: true,
        transform: function (doc, ret) {
            delete ret._id;
            return ret;
        }
    },
    virtuals: {
        partNumber: {
            get: function () {
                return this._id;
            },
            set: function (partNumber: string) {
                this._id = partNumber;
            }
        }
    }
});

const partModel = mongoose.model<Part & mongoose.Document>('Part', partSchema);

export default partModel;