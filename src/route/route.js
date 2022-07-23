const router = require('express').Router();

const userController = require('../controller/userController');
const storeController = require('../controller/storeController')
const bookController = require('../controller/bookController')

// User
router.post('/register', userController.userRegistration)
router.post('/login', userController.userLogin)

// Store
router.post('/createStore/:userId', storeController.storeRegistration)
router.get('/getStore', storeController.getStore)


// Book
router.get('/getGoogleBook', bookController.googleBook)
router.get('/getList', storeController.bookList)

router.post('/addBook/:userId/:storeId', bookController.addBook )
router.put('/updateBook/:userId/:bookId', bookController.updateBook)
router.delete('/deleteBook/:userId/:bookId', bookController.removeBook)


module.exports = router;