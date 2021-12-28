import mongoose from 'mongoose'
import mongoose_delete from 'mongoose-delete';
import slug from 'mongoose-slug-generator';


const Schema = mongoose.Schema;
mongoose.plugin(slug)
var PostSchema = new Schema({
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
PostSchema.plugin(mongoose_delete, {
    deletedAt: true,
    deletedBy: true,
    overrideMethods: 'all',
    validateBeforeDelete: true,
});

const PostModel = mongoose.model('post', PostSchema);

export default PostModel;