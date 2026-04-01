import mongoose, { Schema, model, models } from "mongoose";

const DonationSchema = new Schema({
    donorName: {
        type: String,
        default: "Anonymous",
        trim: true,
    },
    donorEmail: {
        type: String,
        default: "",
        trim: true,
        lowercase: true,
    },
    amount: {
        type: Number,
        default: 0,
        min: 0,
    },
    currency: {
        type: String,
        required: true,
        uppercase: true,
        trim: true,
    },
    currencySymbol: {
        type: String,
        default: "$",
    },
    amountUsd: {
        type: Number,
        default: 0,
        min: 0,
    },
    cause: {
        type: String,
        enum: ["general", "zakat", "sadaqah"],
        default: "general",
    },
    donationType: {
        type: String,
        enum: ["one-time", "monthly"],
        default: "one-time",
    },
    paymentMethod: {
        type: String,
        enum: ["bank-transfer"],
        default: "bank-transfer",
    },
    provider: {
        type: String,
        enum: ["manual"],
        default: "manual",
    },
    paymentStatus: {
        type: String,
        enum: ["succeeded", "pending", "failed"],
        default: "pending",
    },
    verificationStatus: {
        type: String,
        enum: ["pending", "verified", "rejected"],
        default: "pending",
    },
    paymentProofUrl: {
        type: String,
        default: "",
        trim: true,
    },
    paymentCardId: {
        type: Schema.Types.ObjectId,
        ref: "PaymentCard",
        default: null,
    },
    transactionId: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    gatewayReference: {
        type: String,
        default: "",
        trim: true,
    },
    meta: {
        country: {
            type: String,
            default: "",
            uppercase: true,
            trim: true,
        },
        source: {
            type: String,
            default: "web",
            trim: true,
        },
        paymentCardLabel: {
            type: String,
            default: "",
            trim: true,
        },
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

DonationSchema.pre("save", function (next) {
    this.updatedAt = new Date();
    next();
});

DonationSchema.index({ createdAt: -1 });
DonationSchema.index({ paymentMethod: 1, paymentStatus: 1 });
DonationSchema.index({ provider: 1, createdAt: -1 });
DonationSchema.index({ verificationStatus: 1, createdAt: -1 });

const Donation = models.Donation || model("Donation", DonationSchema);

export default Donation;
