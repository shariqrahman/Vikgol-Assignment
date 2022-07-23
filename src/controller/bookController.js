const bookModel = require('../model/bookModel')
const userModel = require('../model/userModel')
const storeModel = require('../model/storeModel')
const validator = require('../validation/validator')
const axios = require('axios');


// Fetch Google Book
const googleBook = async (req, res) => {
    try {
        let titles = req.query.title
        let bookInfo = []
        let googleBookApi = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${titles}`)
        let itemIngoogleApi = googleBookApi.data.items
        for (let i = 0; i < itemIngoogleApi.length; i++) {
            bookInfo[i] = {
                id: itemIngoogleApi[i].id,
                title: itemIngoogleApi[i].volumeInfo.title,
                subtitle: itemIngoogleApi[i].volumeInfo.subtitle,
                authors: itemIngoogleApi[i].volumeInfo.authors,
                discription: itemIngoogleApi[i].volumeInfo.description
            }
        }
        return res.status(200).send({ status: true, totalCount: bookInfo.length, data: bookInfo })
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}


// Add New Book
const addBook = async (req, res) => {
    try {
        const bookDetails = req.body;
        let userId = req.params.userId;
        let storeId = req.params.storeId;

        if (!validator.isValidObjectId(userId)) {
            return res.status(400).send({ Status: false, message: 'Please enter valid userid' })
        }

        if (!validator.isValidObjectId(storeId)) {
            return res.status(400).send({ Status: false, message: 'Please enter valid storeId' })
        }

        if (!validator.isValidRequestBody(bookDetails)) {
            return res.status(400).send({ status: false, message: 'Please enter book details' })
        }

        const { bookid, title, authors, description, stock } = bookDetails;

        if (!validator.isValid(bookid)) {
            return res.status(400).send({ status: false, massage: 'please enter bookid' })
        }

        if (!validator.isValid(title)) {
            return res.status(400).send({ status: false, massage: 'please enter title' })
        }

        if (!validator.isValid(authors)) {
            return res.status(400).send({ status: false, massage: 'please enter authors' })
        }

        if (!validator.isValid(description)) {
            return res.status(400).send({ status: false, massage: 'please enter description' })
        }

        if (!validator.isValid(stock)) {
            return res.status(400).send({ status: false, massage: 'please enter stock' })
        }

        let userDetails = await userModel.findById(userId)
        if (!userDetails) {
            return res.status(404).send({ Status: false, message: 'The user is not found' })
        }

        let storeDetails = await storeModel.findById(storeId)
        if (!storeDetails) {
            return res.status(404).send({ Status: false, message: 'The store is not found' })
        }

        bookDetails.storeId = storeDetails._id;
        if (userDetails.profile == 'User') {
            return res.status(403).send({ Status: false, message: 'Admin can Add book to store' })
        }

        if (userId == req.userId) {
            return res.status(403).send({ status: false, message: 'You are not authorized' })
        }

        const createStore = await bookModel.create(bookDetails)
        return res.status(201).send({ status: true, message: 'Successful', Book: createStore })
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


// Update Existing Book
const updateBook = async (req, res) => {
    try {
        let updateDetails = req.body;
        let userId = req.params.userId;
        let bookId = req.params.bookId;

        if (!validator.isValidObjectId(userId)) {
            return res.status(400).send({ Status: false, message: 'Please enter valid userid' })
        }

        const userDetails = await userModel.findById(userId)
        if (!userDetails) {
            return res.status(404).send({ Status: false, message: 'User is not found' })
        }

        if (!validator.isValidObjectId(bookId)) {
            return res.status(400).send({ Status: false, message: 'Please enter valid inventryId' })
        }

        const findInventry = await bookModel.findOne({ _id: bookId, isDeleted: false })
        if (!findInventry) {
            return res.status(404).send({ status: false, message: 'Inventry Not Found' })
        }

        if (!validator.isValidRequestBody(updateDetails)) {
            return res.status(400).send({ status: false, message: 'Please enter update details' })
        }

        if (req.userId != userId) {
            const { title, subtitle, authors, description, stock } = updateDetails
            let updateData = {}
            if (validator.isValid(title)) {
                updateData['title'] = title
            }

            if (validator.isValid(subtitle)) {
                updateData['subtitle'] = subtitle
            }

            if (validator.isValid(authors)) {
                updateData['authors'] = authors
            }
            if (validator.isValid(description)) {
                updateData['description'] = description
            }
            if (validator.isValid(stock)) {
                if (stock == 0) {
                    updateData['outOfStock'] = true
                }
                updateData['stock'] = stock
            }

            const updated = await bookModel.findOneAndUpdate({ _id: bookId }, { $set: { updateData } }, { new: true })

            return res.status(200).send({ status: true, message: 'Updated successfully', data: updated })

        } else {
            return res.status(403).send({ status: false, message: 'You are not authorized' })
        }

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


// Remove Exist Book
const removeBook = async (req, res) => {
    try {
        let userId = req.params.userId;
        let bookId = req.params.bookId;

        if (!validator.isValidObjectId(bookId)) {
            return res.status(400).send({ Status: false, message: 'Please enter valid bookId' })
        }

        let findInventry = await bookModel.findOne({ _id: bookId, isDeleted: false })
        if (!findInventry) {
            return res.status(404).send({ status: false, message: 'Book Not Found' })
        }

        if (!validator.isValidObjectId(userId)) {
            return res.status(400).send({ Status: false, message: 'Please enter valid userid' })
        }

        let userDetails = await userModel.findById(userId)
        if (!userDetails) {
            return res.status(404).send({ Status: false, message: 'User is not found' })
        }

        if (req.userId == userDetails._id) {
            return res.status(403).send({ status: false, message: 'You are not authorized' })
        }

        await bookModel.findOneAndUpdate({ _id: bookId }, { $set: { isDeleted: true } }, { new: true })
        return res.status(200).send({ status: true, message: 'Successfully Deleted' })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


module.exports.googleBook = googleBook;
module.exports.addBook = addBook
module.exports.updateBook = updateBook
module.exports.removeBook = removeBook