import mongoose from 'mongoose'
import mongoose_delete from 'mongoose-delete';

const Schema = mongoose.Schema;

var commentSchema = new Schema({
    comment: {type: String, required: true},
    idReply: {type: Object},
    author: {type: String, required: true},
    heart: {type:[String], default: []},
    reply: {type: [Object], default: []},
    slug: {type: String, required: true}
}, {timestamps: true});
commentSchema.plugin(mongoose_delete, {
    deletedAt: true,
    deletedBy: true,
    overrideMethods: 'all',
    validateBeforeDelete: true,
});

const PostModel = mongoose.model('comment', commentSchema);

export default PostModel;