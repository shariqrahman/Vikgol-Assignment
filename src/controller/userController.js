const validator = require('../validation/validator')
const userModel = require('../model/userModel')
const jwt = require('jsonwebtoken')

// User Registration
const userRegistration = async (req, res) => {
    try {
        let userDetails = req.body;

        if (!validator.isValidRequestBody(userDetails)) {
            return res.status(400).send({ status: false, message: 'Provide User Details' })
        }

        const { name, profile, email, phone, password, address } = userDetails;

        if (!validator.isValid(name)) {
            return res.status(400).send({ status: false, massage: 'Please enter user name' })
        }

        if (!validator.isValid(profile)) {
            return res.status(400).send({ status: false, massage: 'Please enter profile' })
        }

        let profiles = ["Admin", "User"]
        if (!profiles.includes(profile)) {
            return res.status(400).send({ status: false, message: 'Please Enter Profile in formate Admin or User' })
        }

        if (!validator.isValid(email)) {
            return res.status(400).send({ status: false, massage: 'Please enter email' })
        }

        if (!validator.isValidEmail(email)) {
            return res.status(400).send({ status: false, massage: 'Please enter correct email' })
        }

        let isEmailExists = await userModel.findOne({ phone: phone })
        if (isEmailExists) {
            return res.status(400).send({ status: false, massage: 'Email Address alrady in use' })
        }

        if (!validator.isValid(phone)) {
            return res.status(400).send({ status: false, massage: 'Please enter phone' })
        }

        if (!validator.isValidPhone(phone)) {
            return res.status(400).send({ status: false, massage: 'Enter Correct mobile Number' })
        }

        let isPhoneExists = await userModel.findOne({ phone: phone })
        if (isPhoneExists) {
            return res.status(400).send({ status: false, massage: 'Mobile Number alrady in use' })
        }

        if (!validator.isValid(password)) {
            return res.status(400).send({ status: false, massage: 'Please enter password' })
        }

        if (password.length < 6 || password.length > 15) {
            return res.status(400).send({ status: false, massage: 'please length should be 6 to 15 password' })
        }

        if (!validator.isValid(address.street)) {
            return res.status(400).send({ status: false, massage: 'Please enter street address' })
        }

        if (!validator.isValid(address.city)) {
            return res.status(400).send({ status: false, massage: 'Please enter city address' })
        }

        if (!validator.isValid(address.pincode)) {
            return res.status(400).send({ status: false, massage: 'please enter pincode address' })
        }

        const registeredUser = await userModel.create(userDetails);

        return res.status(201).send({ status: true, message: 'successful', user: registeredUser })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


// User Login
const userLogin = async (req, res) => {
    try {

        let loginDetails = req.body;

        if (!validator.isValidRequestBody(loginDetails)) {
            return res.status(400).send({ status: false, message: 'Please provide email id or password' })
        }

        let { email, password } = loginDetails;

        if (!validator.isValid(email)) {
            return res.status(400).send({ status: false, message: 'Email is required' })
        }

        if (!validator.isValidEmail(email)) {
            return res.status(400).send({ status: false, message: 'Email is not correct' })
        }

        if (!validator.isValid(password)) {
            return res.status(400).send({ status: false, message: 'password is required' })
        }

        const isEmail = await userModel.findOne({ email: email })
        if (!isEmail) {
            return res.status(404).send({ status: false, message: 'Invaild Email and Password' })
        }

        const isPassword = await userModel.findOne({ password: password })
        if (!isPassword) {
            return res.status(404).send({ status: false, message: 'Invaild Email and Password' })
        }

        const userId = isEmail._id
        const token = await jwt.sign({
            userId: userId,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + 10 * 60 * 60
        }, 'Book-Inventory')

        return res.status(200).send({ status: true, message: 'Successful Login', Token: token, Id: userId })
    }
    catch (error) {
        console.log(error)
        return res.status(500).send({ status: false, message: error.message })
    }
}

module.exports.userRegistration = userRegistration;
module.exports.userLogin = userLogin;