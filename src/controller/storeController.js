const storeModel = require('../model/storeModel')
const bookModel = require('../model/bookModel')
const userModel = require('../model/userModel')
const validator = require('../validation/validator')


// Register Store
const storeRegistration = async (req, res) => {
    try {
        let storeDetails = req.body;
        let userId = req.params.userId;

        if (!validator.isValidObjectId(userId)) {
            return res.status(400).send({ Status: false, message: 'Please enter valid userid' })
        }

        if (!validator.isValidRequestBody(storeDetails)) {
            return res.status(400).send({ status: false, message: 'Please enter Store Details' })
        }

        let { storeId, storeName, address } = storeDetails;

        if (!validator.isValid(storeId)) {
            return res.status(400).send({ status: false, massage: 'please enter storeId' })
        }

        let isExistsStoreId = await storeModel.findOne({storeId});
        if(isExistsStoreId) {
            return res.status(400).send({status: false, message: 'Store Already Register' })
        }

        if (!validator.isValid(storeName)) {
            return res.status(400).send({ status: false, massage: 'please enter storeName' })
        }

        let isExistsStoreName = await storeModel.findOne({storeName});
        if(isExistsStoreName) {
            return res.status(400).send({status: false, message: 'Store Already Register' })
        }

        if (!validator.isValid(address.street)) {
            return res.status(400).send({ status: false, massage: 'please enter street address' })
        }

        if (!validator.isValid(address.city)) {
            return res.status(400).send({ status: false, massage: 'please enter city address' })
        }

        if (!validator.isValid(address.pincode)) {
            return res.status(400).send({ status: false, massage: "please enter pincode address" })
        }

        let userDetails = await userModel.findOne({userId})
        if (!userDetails) {
            return res.status(404).send({ Status: false, message: 'User is not found' })
        }

        if (userDetails.profile == 'User') {
            return res.status(403).send({ Status: false, message: 'Admin can create store' })
        }

        let createStore = await storeModel.create(storeDetails)
        return res.status(201).send({ status: true, message: 'Successful', Store: createStore })
    } 
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


// Fetch Stores
const getStore = async function (req, res) {
    try {
        const stores = await storeModel.find()
        if (!stores) {
            return res.status(400).send({ status: false, message: 'Store is not available' })
        }

        return res.status(200).send({ status: true, message: 'Successful', totalStore: stores.length, Stores: stores })
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


const bookList = async function (req, res) {
    try {
        let books = await bookModel.find({ isDeleted: false })
        if (!books) {
            return res.status(400).send({ status: false, message: 'Book is not available'})
        }
        return res.status(200).send({ status: true, message: 'Successful', totalBooks: books.length, Books: books })
    } 
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

module.exports.storeRegistration = storeRegistration;
module.exports.getStore = getStore;
module.exports.bookList = bookList;