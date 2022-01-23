import mongoose from 'mongoose'
import mongoose_delete from 'mongoose-delete';

const Schema = mongoose.Schema;

var commentSchema = new Schema({
    comment: {type: String, required: true},//content of comment
    idReply: {type: Object},//comment reply this comment
    author: {type: String, required: true},
    heart: {type:[String], default: []},
    reply: {type: [Object], default: []},
    slug: {type: String, required: true},//id of post
    idParentReply: {type: Object},//the comment this comment reply
    replyClosest: {//username and display name of comment we reply
        username: {type: String},
        displayName: {type: String},
    }
}, {timestamps: true});
commentSchema.plugin(mongoose_delete, {
    deletedAt: true,
    deletedBy: true,
    overrideMethods: 'all',
    validateBeforeDelete: true,
});

const PostModel = mongoose.model('comment', commentSchema);

export default PostModel;