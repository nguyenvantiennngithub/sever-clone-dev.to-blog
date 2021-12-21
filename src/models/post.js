import mongoose from 'mongoose'
const Schema = mongoose.Schema;
import slug from 'mongoose-slug-generator';
mongoose.plugin(slug)
const PostSchema = new Schema({
    title: {type: String, required: true},
    content:{text: String, html: String},
    tags: [String],
    cover: String,
    author: String,
    date: {type: Date, default: Date.now},
    slug: {type: String, slug: "title", unique: true},
    bookmark: {type: [String], default: []},
    heart: {type: [String], default: [], required: false},

}, {timestamps: true});

const PostModel = mongoose.model('post', PostSchema);

export default PostModel;