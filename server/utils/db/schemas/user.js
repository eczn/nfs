// user.js
const mongoose = require('../connect'); 

let userSchema = mongoose.Schema({
	// WX_USER_INFO
	username: {
		type: String, 
		required: true
	},
	headimgurl: {
		type: String, 
        default: "/img/default-avatar.png"
    },
    pwd: {
        type: String, 
        required: true
    }, 
	created_at: {
		type: Date, 
		default: Date.now
	}
});

module.exports = userSchema; 
