import mongoose from 'mongoose'
import mongoose_delete from 'mongoose-delete';

const Schema = mongoose.Schema;

var notificationSchema = new Schema({
    post: {type: String, required: true},
    username: {type: [String], default: []},
    type: {type: String, required: true},
    comment: {type: Object},
    seen: {type: [Object], default: []},
}, {timestamps: true});
notificationSchema.plugin(mongoose_delete, {
    deletedAt: true,
    deletedBy: true,
    overrideMethods: 'all',
    validateBeforeDelete: true,
});

const NotificationModel = mongoose.model('notification', notificationSchema);

export default NotificationModel;