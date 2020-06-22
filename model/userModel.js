const mongose = require('mongoose');
const Schema = mongose.Schema;

const UserSchema = new Schema({
    username: {
        type:String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'employee',
        enum:["employee", "admin"]
    },
    skills: [{
        name:String, 
        description: String
    }],
    accessToken: {
        type: String
    }
});

const User = mongose.model('user', UserSchema);
module.exports = User;
