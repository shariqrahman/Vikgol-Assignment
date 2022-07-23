const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId;

const bookSchema = new mongoose.Schema({
    bookid: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    authors:{
        type: [String],
        required: true
    },
    description:{
        type: String,
        required: true
    },
    stock: {
        type: Number
    },
    outOfStock: {
        type: Boolean

    },
    storeId:{
        type:ObjectId,
        ref: 'Store',
        required:true
    },
    isDeleted:{
        type:Boolean,
        default:false
    }
})

module.exports = mongoose.model('Book', bookSchema);