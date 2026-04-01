import { Schema, model, models } from "mongoose";

const PaymentCardSchema = new Schema({
    label: {
        type: String,
        required: true,
        trim: true,
    },
    accountTitle: {
        type: String,
        required: true,
        trim: true,
    },
    accountNumber: {
        type: String,
        required: true,
        trim: true,
    },
    bankName: {
        type: String,
        default: "",
        trim: true,
    },
    iban: {
        type: String,
        default: "",
        trim: true,
    },
    instructions: {
        type: String,
        default: "",
        trim: true,
    },
    sortOrder: {
        type: Number,
        default: 0,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

PaymentCardSchema.pre("save", function (next) {
    this.updatedAt = new Date();
    next();
});

PaymentCardSchema.index({ isActive: 1, sortOrder: 1, createdAt: -1 });

const PaymentCard = models.PaymentCard || model("PaymentCard", PaymentCardSchema);

export default PaymentCard;
