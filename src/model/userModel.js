const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    profile: {
        type: String,
        enum: ['Admin', 'User']
    },
    email: {
        type: String,
        trim:true,
        unique: true,
        required: true,
        
    },
    phone: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    address: {
       street: String,
       city: String,
       pincode: String
    }
})

module.exports = mongoose.model('User', userSchema)