import mongoose, { Schema, model, models } from 'mongoose';

const PostSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
    },
    type: {
        type: String,
        required: true,
        enum: ['post', 'image', 'video'],
        default: 'post',
    },
    content: {
        type: String,
        required: [true, 'Content is required'],
    },
    videoUrl: {
        type: String,
        default: '',
    },
    mediaUrl: {
        type: String,
        default: '',
    },
    thumbnail: {
        type: String,
        default: '',
    },
    category: {
        type: String,
        enum: ['reminder', 'quran', 'hadith', 'dua', 'general', 'announcement'],
        default: 'general',
    },
    status: {
        type: String,
        enum: ['published', 'draft'],
        default: 'draft',
    },
    author: {
        type: String,
        default: 'Admin',
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

PostSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});

const Post = models.Post || model('Post', PostSchema);

export default Post;
