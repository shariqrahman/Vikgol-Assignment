const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId;

const storeSchema = new mongoose.Schema({
   storeId:{
    type:String,
    required:true
   },
   storeName:{
    type:String,
    required:true
   },
   userId: {
      type: ObjectId,
      ref: 'User',
      required: true
   },
   address: {
    street: String,
    city: String,
    pincode: Number
   }
})

module.exports = mongoose.model('Store', storeSchema);