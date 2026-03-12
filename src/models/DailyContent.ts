import mongoose, { Schema, model, models } from 'mongoose';

const DailyContentSchema = new Schema({
    type: {
        type: String,
        required: true,
        enum: ['ayah', 'hadith', 'dua', 'reminder'],
        unique: true
    },
    arabic: {
        type: String,
        default: ''
    },
    english: {
        type: String,
        required: true
    },
    translation: {
        type: String, // For Urdu or other translations
        default: ''
    },
    reference: {
        type: String,
        default: ''
    },
    subtitle: {
        type: String,
        default: ''
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
});

const DailyContent = models.DailyContent || model('DailyContent', DailyContentSchema);

export default DailyContent;
