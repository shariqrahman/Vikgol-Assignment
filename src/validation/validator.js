const mongoose = require('mongoose')

const isValidRequestBody = function(requestBody) {
    return Object.keys(requestBody).length > 0
}

const isValid = (value) => {
  if (typeof value === 'undefined' || typeof value === null) return false
  if (typeof value === 'string' && value.trim().length == 0) return false
  return true
}

const isValidObjectId= function(ObjectId){
  return mongoose.Types.ObjectId.isValid(ObjectId)
}

const isValidEmail = function(email) {
    return (/^\w+([\.-]?\w+)@\w+([\. -]?\w+)(\.\w{2,3})+$/.test(email))
  }

  const isValidPhone = function(phone){
    return (/^([+]\d{2})?\d{10}$/.test(phone))
}


module.exports.isValidRequestBody = isValidRequestBody;
module.exports.isValid = isValid;
module.exports.isValidEmail = isValidEmail
module.exports.isValidPhone = isValidPhone
module.exports.isValidObjectId = isValidObjectId