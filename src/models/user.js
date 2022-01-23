import mongoose from 'mongoose'
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const UserSchema = new Schema({
  username: {type: String, unique: true, required: true},
  displayName: {type: String},
  bio:{type: String, default: 'this is some text to describe about you'},
  email: String,
  password: String,
  heart: {type: [String], default: []},
  bookmark: {type: [String], default: []},
  following: {type: [String], default: []},//mình follow người khác
  followers: {type: [String], default: []},//người khác follow mình
  notifications: {type: [Object], default: []},
  posts: {type: [String], default: []},
  avatar: {
    type: String,
    default: 'https://res.cloudinary.com/vantiennn/image/upload/v1639629198/BlogProject/Post/dd23bbdf7fcbed6a24dd223cb1eec1b7.png'
  }
}, {timestamps: true});

const UserModel = mongoose.model('users', UserSchema);
export default UserModel;